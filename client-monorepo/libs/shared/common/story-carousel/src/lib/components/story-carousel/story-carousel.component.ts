import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable, of, race, timer, shareReplay, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { StoryInterface } from '../../data-access/models/story.interface';

/**
 * Story Carousel Component
 *
 * Displays a series of stories with automatic progression, image preloading,
 * and smooth transitions between stories.
 */
@Component({
  selector: 'common-story-carousel-story-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-carousel.component.html',
  styleUrl: './story-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryCarouselComponent implements OnInit {
  // Injects
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  readonly stories = input<StoryInterface[]>([]);
  readonly loop = input(false);

  // Outputs
  readonly storiesComplete = output<void>();

  // Public signals
  readonly currentIndex = signal(0);
  readonly progress = signal(0);
  readonly showImage = signal(false);
  readonly imageLoaded = signal(false);

  // Computed values
  readonly activeStory = computed(() => this.stories()[this.currentIndex()]);
  readonly activeGradient = computed(() => {
    const story = this.activeStory();
    if (!story?.backgroundColor?.length) {
      return 'none';
    }
    const stops = story.backgroundColor.map((item) => `${item?.color} ${item?.stop}`).join(', ');
    return `linear-gradient(180deg, ${stops})`;
  });
  readonly backgroundStyle = computed(() => ({
    '--dynamic-gradient': this.activeGradient(),
    '--dynamic-image': `url(${this.activeStory().backgroundImage})`,
  }));

  // Configuration constants
  private readonly PROGRESS_INTERVAL_MS = 50;
  private readonly PRELOAD_TIMEOUT_MS = 5000;
  private readonly CURRENT_STORY_TIMEOUT_MS = 3000;
  private readonly NEARBY_PRELOAD_NEXT = 3;
  private readonly NEARBY_PRELOAD_PREV = 2;

  // Private state
  private intervalId: number | null = null;
  private startTime = 0;
  private rafId: number | null = null;
  private currentStorySubscription: Subscription | null = null;

  // Cache for loaded images - stores the actual Image elements
  private readonly imageCache = new Map<string, HTMLImageElement>();

  // Cache for in-flight image load observables to prevent duplicate requests
  private readonly imageLoadCache = new Map<string, Observable<HTMLImageElement>>();

  constructor() {
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnInit(): void {
    if (this.stories().length > 0) {
      this.initializeCarousel();
    }
  }

  /**
   * Advances to the next story or completes the carousel
   */
  nextStory(): void {
    const isLastStory = this.currentIndex() >= this.stories().length - 1;

    if (!isLastStory) {
      this.transitionToStory(this.currentIndex() + 1);
    } else if (this.loop()) {
      this.transitionToStory(0);
    } else {
      this.completeCarousel();
    }
  }

  /**
   * Goes back to the previous story
   */
  previousStory(): void {
    const isFirstStory = this.currentIndex() === 0;

    if (!isFirstStory) {
      this.transitionToStory(this.currentIndex() - 1);
    } else if (this.loop()) {
      this.transitionToStory(this.stories().length - 1);
    } else {
      this.startProgress();
    }
  }

  /**
   * Calculates the progress bar width for a given story index
   */
  getProgressWidth(index: number): number {
    if (index < this.currentIndex()) return 100;
    if (index === this.currentIndex()) return this.progress();
    return 0;
  }

  private initializeCarousel(): void {
    this.preloadAllImages()
      .pipe(
        switchMap(() => this.showCurrentStory()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private preloadAllImages(): Observable<void> {
    const allUrls = this.collectAllImageUrls();

    if (allUrls.size === 0) {
      return of(undefined);
    }

    const loadObservables = Array.from(allUrls).map((url) => this.loadImage(url).pipe(catchError(() => of(null))));

    return race(forkJoin(loadObservables).pipe(map(() => undefined)), timer(this.PRELOAD_TIMEOUT_MS).pipe(map(() => undefined)));
  }

  private collectAllImageUrls(): Set<string> {
    const urlSet = new Set<string>();

    for (const story of this.stories()) {
      const urls = this.extractImageUrls(story);
      urls.forEach((url) => urlSet.add(url));
    }

    return urlSet;
  }

  private extractImageUrls(story: StoryInterface): string[] {
    return [story.image, story.backgroundImage].filter((url): url is string => Boolean(url));
  }

  /**
   * Loads an image and caches it. Uses shareReplay to prevent duplicate loads
   * for the same URL when multiple subscribers request it simultaneously.
   */
  private loadImage(url: string): Observable<HTMLImageElement> {
    // Return already loaded image from cache
    const cachedImage = this.imageCache.get(url);
    if (cachedImage) {
      return of(cachedImage);
    }

    // Return existing observable if this image is currently being loaded
    const cachedObservable = this.imageLoadCache.get(url);
    if (cachedObservable) {
      return cachedObservable;
    }

    // Create new observable for loading this image
    const loadObservable = new Observable<HTMLImageElement>((observer) => {
      const img = new Image();

      img.onload = () => {
        this.imageCache.set(url, img);
        this.imageLoadCache.delete(url);
        observer.next(img);
        observer.complete();
      };

      img.onerror = () => {
        this.imageLoadCache.delete(url);
        observer.error(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;

      // Cleanup function if subscription is cancelled
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    // Cache the observable to prevent duplicate requests
    this.imageLoadCache.set(url, loadObservable);

    return loadObservable;
  }

  private waitForCurrentStoryImages(): Observable<void> {
    const story = this.activeStory();
    const urls = this.extractImageUrls(story);

    if (urls.length === 0) {
      return of(undefined);
    }

    const loadObservables = urls.map((url) => this.loadImage(url).pipe(catchError(() => of(null))));

    return race(forkJoin(loadObservables).pipe(map(() => undefined)), timer(this.CURRENT_STORY_TIMEOUT_MS).pipe(map(() => undefined)));
  }

  private showCurrentStory(): Observable<void> {
    return this.waitForCurrentStoryImages().pipe(
      tap(() => {
        this.imageLoaded.set(true);

        // RAF for smooth animation timing
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          this.showImage.set(true);
          this.startProgress();
          this.preloadNearbyImages();
        });
      }),
    );
  }

  private preloadNearbyImages(): void {
    const nearbyIndices = this.getNearbyIndices();

    for (const index of nearbyIndices) {
      if (this.isValidIndex(index)) {
        const story = this.stories()[index];
        const urls = this.extractImageUrls(story);

        for (const url of urls) {
          // Fire and forget - these will auto-complete, no unsubscribe needed
          this.loadImage(url)
            .pipe(catchError(() => of(null)))
            .subscribe();
        }
      }
    }
  }

  private getNearbyIndices(): number[] {
    const current = this.currentIndex();
    const indices: number[] = [];

    // Preload next stories
    for (let i = 1; i <= this.NEARBY_PRELOAD_NEXT; i++) {
      indices.push(current + i);
    }

    // Preload previous stories
    for (let i = 1; i <= this.NEARBY_PRELOAD_PREV; i++) {
      indices.push(current - i);
    }

    return indices;
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.stories().length;
  }

  private startProgress(): void {
    this.stopProgress();
    this.progress.set(0);
    this.startTime = Date.now();

    this.intervalId = window.setInterval(() => {
      this.updateProgress();
    }, this.PROGRESS_INTERVAL_MS);
  }

  private updateProgress(): void {
    const elapsed = Date.now() - this.startTime;
    const duration = this.activeStory().duration;
    const newProgress = Math.min((elapsed / duration) * 100, 100);

    this.progress.set(newProgress);

    if (newProgress >= 100) {
      this.nextStory();
    }
  }

  private stopProgress(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private transitionToStory(index: number): void {
    this.stopProgress();
    this.resetStoryState();

    // Cancel any in-progress story transition
    if (this.currentStorySubscription) {
      this.currentStorySubscription.unsubscribe();
      this.currentStorySubscription = null;
    }

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.currentIndex.set(index);
      this.currentStorySubscription = this.showCurrentStory().subscribe();
    });
  }

  private resetStoryState(): void {
    this.progress.set(0);
    this.showImage.set(false);
    this.imageLoaded.set(false);
  }

  private completeCarousel(): void {
    this.stopProgress();
    this.progress.set(100);
    this.storiesComplete.emit();
  }

  private cleanup(): void {
    this.stopProgress();

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.currentStorySubscription) {
      this.currentStorySubscription.unsubscribe();
      this.currentStorySubscription = null;
    }

    this.imageCache.clear();
    this.imageLoadCache.clear();
  }
}
