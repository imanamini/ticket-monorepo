import {
  AfterContentInit,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  Renderer2,
  signal,
  viewChild
} from '@angular/core';
import { DOCUMENT, NgClass, NgStyle } from '@angular/common';
import { SwipingEventModel } from '../../data-access/models/swiping-event.model';
import { SwipePointEventModel } from '../../data-access/models/swipe-point-event.model';
import { isEqual } from '../../util/isEqual';
import { CarouselSlideDirective } from '../../data-access/directives/carousel-slide.directive';
import { SwipeDetectorDirective } from '../../data-access/directives/swipe-detector.directive';
import { InsButtonComponent } from '../ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { UniqueId } from '../../util/uniqueId';

@Component({
  selector: 'ins-carousel',
  standalone: true,
  imports: [
    NgClass,
    SwipeDetectorDirective,
    InsButtonComponent,
    NgStyle
  ],
  templateUrl: './ins-carousel.component.html',
  styleUrl: './ins-carousel.component.scss'
})
export class InsCarouselComponent implements AfterContentInit, OnDestroy {

  slides = contentChildren<CarouselSlideDirective>(CarouselSlideDirective);
  itemsContainer = viewChild.required<ElementRef>('itemsContainer');
  mainContainer = viewChild.required<ElementRef>('mainContainer');

  // Injections
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  // Inputs
  visibleItemCount = input<number>(1);
  numScroll = input<number>(1);
  carouselPadding = input<string>('');
  mode = input<'SINGLE' | 'CARD'>('SINGLE');
  mainContainerClasses = input<string>('');
  swipeThreshold = input<number>(30);
  fixedWidth = input<number>(0);
  fixedGap = input<number>(0);
  index = model<number>(0);
  scaleAmount = input<number>(0.7);
  isFixedWidth = input<boolean>(false);
  isFixedGap = input<boolean>(false);
  centerMode = input<boolean>(true);
  disableScaling = input<boolean>(false);
  showNavigation = input<boolean>(true);
  showDots = input<boolean>(true);
  showButtons = input<boolean>(true);
  isSlideOverflowVisible = input<boolean>(false);
  navigationContainerClasses = input<string>('');
  navigationDotsContainerClasses = input<string>('');
  disableNavigationDots = input<boolean>(false);
  navigationButtonSize = input<InsButtonSizeEnum>(InsButtonSizeEnum.Medium);
  navigationButtonNextText = input<string>('');
  navigationButtonPrevText = input<string>('');
  scalingTransformOrigin = input<string>('center bottom');
  changeStepThresholdPercentage = input(50, {
    transform: (value: number): number => Math.min(90, Math.max(10, value)),
  });
  enableAutoPlay = input<boolean>(false);
  autoPlayDurationMillis = input<number>(3000);
  autoPlayCounts = input<number>(0); // 0 is infinite
  autoPlayRebootDurationMillis = input<number>(10000);

  // Outputs
  navigationBtnClicked = output<'NEXT' | 'PREV'>();
  isAnimationRunning = output<boolean>();
  singleTapped = output<void>();
  isSwiping = output<boolean>();

  // Variables
  id: string | undefined;
  carouselStyle: any;
  isDragging = false;
  currentWalkX = 0;
  lastLeft = 0;
  calculatedGap = 0;
  calculatedWidth = 0;
  wrappers: any[] = [];
  isSwipingVertically = false;
  transitionSteps: number[] = [];
  isAnimating = false;
  onlyOneNavigation = computed(() => this.showDots() !== this.showButtons());
  dots = signal<number[]>([]);
  private previousSlides: CarouselSlideDirective[] | undefined;
  private autoPlayIntervalId: any;
  private autoPlayRebootTimeoutId: any;
  private autoPlayExecutedCount = 0;

  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  constructor() {
    effect(
      () => {
        if (this.index() !== undefined) {
          this.step(false);
          if (this.transitionSteps.length === 0) {
            this.calculateSteps();
          }
        }
        if (this.slides()) {
          const currentSlides = this.slides()?.slice();
          if (!this.previousSlides || !isEqual(currentSlides, this.previousSlides)) {
            this.previousSlides = currentSlides;
            this.createStyle();
            this.wrapSlides();
            this.calculateSteps();
            this.updateSlidesState();
            if (this.slides()?.length) {
              this.startAutoPlay();
            }
          }
        }
      },
      {allowSignalWrites: true},
    );
  }

  ngAfterContentInit(): void {
    this.id = UniqueId();
  }

  private startAutoPlay(): void {
    if (!this.enableAutoPlay()) {
      return;
    }
    if (this.autoPlayIntervalId) {
      return;
    }
    this.autoPlayIntervalId = setInterval(() => {
      this.index.update((v) => v + 1);
      if (this.index() > this.slides()?.length - 1) {
        this.index.set(0);
        if (this.autoPlayCounts()) {
          this.autoPlayExecutedCount++;
          if (this.autoPlayExecutedCount >= this.autoPlayCounts()) {
            clearInterval(this.autoPlayIntervalId);
          }
        }
      }
    }, this.autoPlayDurationMillis());
  }

  private rebootAutoPlay(): void {
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = undefined;
    }
    if (!this.autoPlayRebootTimeoutId) {
      this.autoPlayRebootTimeoutId = setTimeout(() => {
        this.startAutoPlay();
      }, this.autoPlayRebootDurationMillis());
    }
  }

  createStyle(): void {
    if (this.mode() === 'SINGLE') {
      if (!this.carouselStyle) {
        this.carouselStyle = this.renderer.createElement('style');
        this.carouselStyle.type = 'text/css';
        this.renderer.appendChild(this.document.head, this.carouselStyle);
      }
      this.carouselStyle.innerHTML = `#${this.id} .carousel-item {
				flex: 1 0 ${100 / this.visibleItemCount()}%
			}`;
    }
  }

  wrapSlides(): void {
    this.dots.set([]);
    this.slides().forEach((slide, index) => {
      this.dots.update((v) => [...v, index]);
      const wrapper = this.renderer.createElement('div');
      this.renderer.addClass(wrapper, 'slide-wrapper');
      this.renderer.setStyle(wrapper, 'transition', 'transform 0.5s ease-in-out');
      this.renderer.setStyle(wrapper, 'overflow', this.isSlideOverflowVisible() ? 'visible' : 'hidden');
      const parent = slide.element?.nativeElement?.parentNode;
      this.renderer.insertBefore(parent, wrapper, slide.element?.nativeElement);
      this.renderer.appendChild(wrapper, slide.element?.nativeElement);
      this.wrappers.push(wrapper);
    });
    this.calculateWidthAndGap();
  }

  calculateWidthAndGap(): void {
    const mainWidth = this.roundIt(this.mainContainer().nativeElement.getBoundingClientRect().width);
    // Just Fixed Width
    if (this.isFixedWidth() && !this.isFixedGap()) {
      this.calculatedGap = this.roundIt((mainWidth - this.visibleItemCount() * this.fixedWidth()) / this.visibleItemCount());
      this.calculatedWidth = this.fixedWidth();
    }
    // Just Fixed Gap
    if (this.isFixedGap() && !this.isFixedWidth()) {
      this.calculatedWidth = this.roundIt((mainWidth - this.visibleItemCount() * this.fixedGap()) / this.visibleItemCount());
      this.calculatedGap = this.fixedGap();
    }
    // Fixed Gap And Width
    if (this.isFixedGap() && this.isFixedWidth()) {
      this.calculatedWidth = this.fixedWidth();
      this.calculatedGap = this.fixedGap();
    }
    this.setWrappersWidthAndGap(this.calculatedWidth, this.calculatedGap);
    if (this.transitionSteps.length === 0) {
      this.calculateSteps();
    }
  }

  setWrappersWidthAndGap(width: number, gap: number): void {
    if (!this.centerMode()) {
      this.itemsContainer().nativeElement.style.padding = `0 ${this.calculatedGap}px`;
    }
    const mainContainerWidth = this.wrappers.length * width + (this.wrappers.length + 1) * gap;
    this.itemsContainer().nativeElement.style.gap = gap + 'px';
    this.itemsContainer().nativeElement.style.width = mainContainerWidth + 'px';
    this.wrappers.forEach((wrapper) => {
      this.renderer.setStyle(wrapper, 'min-width', width + 'px');
      this.renderer.setStyle(wrapper, 'max-width', width + 'px');
      this.renderer.setStyle(wrapper, 'display', 'flex');
      this.renderer.setStyle(wrapper, 'flex-direction', 'flex-row');
      this.renderer.setStyle(wrapper, 'justify-content', 'center');
    });
  }

  calculateSteps(): void {
    this.transitionSteps = [];
    const mainWidth = this.roundIt(this.mainContainer().nativeElement.getBoundingClientRect().width);
    const gap = this.calculatedGap;
    const slideWidth = this.calculatedWidth;
    const stepWidth = slideWidth + gap;
    let step0 = gap / 2;
    if (this.centerMode()) {
      if (this.visibleItemCount() % 2 === 0) {
        step0 = -slideWidth / 2;
      } else {
        step0 = -(mainWidth - slideWidth) / 2;
      }
    } else {
      step0 = 0;
    }
    this.slides().forEach((slide, index) => {
      this.transitionSteps.push(this.roundIt(step0 + index * stepWidth));
    });
    if (this.index() > 0) {
      this.updateActiveSlide();
    } else {
      this.translateItemsContainer(this.transitionSteps[0]);
    }
  }

  // Start the carousel movement
  onSwipeStart(e: SwipePointEventModel): void {
    this.isDragging = true;
    this.rebootAutoPlay();
    this.currentWalkX = 0;
    this.itemsContainer().nativeElement.style.transition = 'none';
  }

  handleSwipingVertically(event: boolean): void {
    this.isSwipingVertically = event;
  }

  // Carousel is on the move
  swiping(e: SwipingEventModel): void {
    if (!this.isDragging) {
      return;
    }
    if (!this.isSwipingVertically) {
      this.isSwiping.emit(true);
      this.currentWalkX = e.deltaX;
      this.itemsContainer().nativeElement.style.transform = `translateX(${this.currentWalkX + this.lastLeft}px)`;
    }
  }

  // Carousel move is ended
  onSwipeX(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.updateActiveSlide();
    }
  }

  onSwipeEnd(): void {
    this.isSwiping.emit(false);
  }

  private updateActiveSlide(isDragging = true): void {
    if (!this.transitionSteps?.length) {
      return;
    }
    const translateAmount = this.calculateNearestTranslatePoint(
      isDragging ? this.currentWalkX + this.lastLeft + this.transitionSteps[0] : this.lastLeft + this.transitionSteps[0],
    );
    this.index.set(this.transitionSteps.indexOf(translateAmount));
    this.lastLeft = translateAmount;
    this.translateItemsContainer(translateAmount);
    this.updateSlidesState();
  }

  private updateSlidesState(): void {
    this.slides().forEach((slide, index) => {
      switch (this.mode()) {
        // Apply custom styles based on the mode
        case 'SINGLE':
          slide.isActive = index === this.index();
          break;
        case 'CARD':
          slide.customStyle = {...this.getCustomStyles(index), maxWidth: '100%'};
          break;
      }
    });
  }

  calculateNearestTranslatePoint(totalWalkX: number): number {
    const length = this.transitionSteps.length;
    if (!length) {
      return 0;
    }

    let downIndex = 0;
    let upIndex = 1;
    const thresholdRatio = this.changeStepThresholdPercentage() / 100;

    // Calculate Up and Down in Array
    if (totalWalkX > this.transitionSteps[length - 1]) {
      upIndex = length - 1;
      downIndex = length - 2;
    } else {
      for (let i = 0; i < length; i++) {
        if (i < length - 1) {
          if (totalWalkX < this.transitionSteps[i]) {
            upIndex = i;
            downIndex = i - 1;
            break;
          }
        } else {
          upIndex = length - 1;
          downIndex = length - 2;
          break;
        }
      }
    }

    if (upIndex === 0) {
      downIndex = 0;
      upIndex = 1;
    }

    // Calculate the transition threshold based on the provided percentage
    const stepDistance = this.transitionSteps[upIndex] - this.transitionSteps[downIndex];
    const thresholdDistance = stepDistance * thresholdRatio;
    const downDistance = Math.abs(this.transitionSteps[downIndex] - totalWalkX);
    const upDistance = Math.abs(this.transitionSteps[upIndex] - totalWalkX);

    // Choose the nearest point based on the threshold distance
    const moveRight = this.currentWalkX > 0;
    return moveRight
      ? downDistance > thresholdDistance
        ? this.transitionSteps[upIndex]
        : this.transitionSteps[downIndex]
      : upDistance > thresholdDistance
        ? this.transitionSteps[downIndex]
        : this.transitionSteps[upIndex];
  }

  private getCustomStyles(index: number): { [key: string]: string } {
    if (this.mode() === 'CARD') {
      if (index === this.index()) {
        return {
          transform: 'scale(1)',
          transition: 'transform 0.5s ease-in-out',
          transformOrigin: this.scalingTransformOrigin(),
        };
      } else if (index === this.index() - 1 || index === this.index() + 1) {
        return {
          transform: this.disableScaling() ? 'scale(1)' : `scale(${this.scaleAmount()})`,
          transition: 'transform 0.5s ease-in-out',
          transformOrigin: this.scalingTransformOrigin(),
        };
      } else {
        return {
          transform: this.disableScaling() ? 'scale(1)' : `scale(${this.scaleAmount()})`,
          transition: 'transform 0.5s ease-in-out',
          transformOrigin: this.scalingTransformOrigin(),
        };
      }
    } else {
      return {};
    }
  }

  handleNavigationBtnClick(direction: 'NEXT' | 'PREV'): void {
    if (direction === 'NEXT') {
      if (this.index() !== this.slides.length - 1) {
        this.index.update((v) => v + 1);
      }
    } else if (direction === 'PREV') {
      if (this.index() !== 0) {
        this.index.update((v) => v - 1);
      }
    }
    this.navigationBtnClicked.emit(direction);
    this.step(false);
  }

  step(isDragging = true): void {
    this.lastLeft = this.roundIt(this.index() * (this.calculatedWidth + this.calculatedGap));
    this.updateActiveSlide(isDragging);
  }

  translateItemsContainer(amount: number): void {
    amount = this.roundIt(amount);
    this.itemsContainer().nativeElement.style.transition = 'transform 0.5s ease-in-out';
    this.itemsContainer().nativeElement.style.transform = `translateX(${amount}px)`;
  }

  roundIt(value: number): number {
    return Math.round(value * 10) / 10;
  }

  handleAnimationRunning(isRunning: boolean): void {
    this.isAnimating = isRunning;
    this.isAnimationRunning.emit(isRunning);
  }

  handleSingleTap(): void {
    if (!this.isAnimating) {
      this.singleTapped.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.autoPlayRebootTimeoutId) {
      clearTimeout(this.autoPlayRebootTimeoutId);
    }
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
    }
  }
}
