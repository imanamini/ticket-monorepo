import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemComponent } from '@client-monorepo/common/ui-components';
import { rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { SocialPostPreviewComponent } from '../social-post-preview/social-post-preview.component';
import { SocialApiService, SocialPost, SocialProductEventPrefix, SocialSearchPostConfig, SocialStorePost } from '@client-monorepo/social';
import { Router } from '@angular/router';
import { SocialService } from '@client-monorepo/social';

@Component({
  selector: 'common-social-posts-grid',
  standalone: true,
  imports: [CommonModule, NoItemComponent, ScrolledToEndDirective, SocialPostPreviewComponent],
  templateUrl: './social-posts-grid.component.html',
  styleUrl: './social-posts-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialPostsGridComponent implements OnInit {
  // Injections
  socialApi = inject(SocialApiService);
  router = inject(Router);
  socialService = inject(SocialService);

  // Inputs
  postIds = input<string[] | undefined>(undefined);
  disablePagination = input(false);
  pageSize = input(24);
  columns = input<number>(3);
  userName = input<string | undefined>(undefined);
  showNoItems = input(false);
  searchText = input<string | undefined>(undefined);
  gridMode = input<'SQUARE' | 'RECTANGLE'>('RECTANGLE');
  disableClickFunction = input(false);
  disableInternalApiCall = input(false);
  enableShuffleMode = input(false);
  storePost = input<SocialStorePost | undefined>(undefined);

  // Outputs
  onEmpty = output<void>();
  onSuccess = output<boolean>();

  // Variables
  protected readonly rangeCreator = rangeCreator;
  loading = signal(false);
  initialized = signal(false);
  posts = signal<SocialPost[]>([]);
  hasNextPage = signal(true);
  gridColumns = computed(() => {
    return { 'grid-template-columns': `repeat(${this.columns()}, 1fr)` };
  });
  isNoItemsVisible = computed(() => !this.loading() && this.initialized() && !this.posts().length && this.showNoItems());
  showFirstLoadingSkeleton = computed(() => this.loading() && !this.initialized());
  showGrid = computed(() => this.initialized() && this.posts().length);
  page = 0;

  constructor() {
    effect(
      () => {
        if (this.disableInternalApiCall() && this.storePost()) {
          this.initialized.set(true);
          this.posts.set(this.storePost()!.posts);
        }
      },
      { allowSignalWrites: true },
    );
    effect(() => {
      if (this.initialized() && !this.posts().length && !this.loading() && this.page === 0) {
        this.onEmpty.emit();
      }
    });
    effect(
      () => {
        if (this.searchText()) {
          if (this.searchText()!.length > 1) {
            this.getPosts(true);
          }
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    if (!this.searchText()) {
      this.getPosts();
    }
  }

  getPosts(reset = false): void {
    if (this.disableInternalApiCall()) return;
    this.loading.set(true);
    if (reset) {
      this.initialized.set(false);
      this.page = 0;
    }
    const config: SocialSearchPostConfig = {
      page: this.page,
      size: this.pageSize(),
      searchText: this.searchText(),
      socialUserName: this.userName(),
      postIds: this.postIds(),
      project: 'EXPLORE',
    };
    this.socialApi.searchPosts(config).subscribe({
      next: (res) => {
        this.hasNextPage.set(res.posts.length >= this.pageSize() || res.hasFiltered === true);
        const shuffledPosts = this.enableShuffleMode() ? this.shuffleArray([...res.posts]) : [...res.posts];
        this.posts.update((v) => [...(v ?? []), ...shuffledPosts]);
        this.loading.set(false);
        this.initialized.set(true);
        this.emitSuccession();
      },
      error: () => {
        this.onSuccess.emit(false);
        this.initialized.set(true);
      },
    });
  }

  emitSuccession(): void {
    if (this.postIds() && this.posts().length < this.pageSize()) {
      this.onSuccess.emit(false);
    } else {
      this.onSuccess.emit(true);
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  handlePostClick(postId: string): void {
    if (this.disableClickFunction()) return;
    this.socialService.sendClickEvent(SocialProductEventPrefix + postId);
    this.router.navigate(['stores', 'social', 'post', postId]);
  }

  handleScrolledToEnd(): void {
    if (this.disablePagination()) return;
    if (this.hasNextPage()) {
      this.page++;
      this.getPosts();
    }
  }
}
