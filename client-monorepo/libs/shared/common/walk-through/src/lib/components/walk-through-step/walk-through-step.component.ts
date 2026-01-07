import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalkThroughService, WalkThroughStep } from '@client-monorepo/shared/common/walk-through';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-walk-through-step',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './walk-through-step.component.html',
  styleUrl: './walk-through-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalkThroughStepComponent implements AfterViewInit, OnDestroy {
  step = input.required<WalkThroughStep>();
  globalConfig = computed(() => this.walkthroughService.config());
  walkThroughStep = viewChild<ElementRef>('walkThroughStep');
  anchor = viewChild<ElementRef>('anchor');
  hostElement!: HTMLElement;
  globalBackground = '';
  prevZIndex = '';
  showDots = computed(() => {
    return this.walkthroughService.config().steps().length > 1;
  });
  nextStep!: WalkThroughStep;
  initialized = signal(false);

  walkthroughService = inject(WalkThroughService);
  renderer = inject(Renderer2);
  router = inject(Router);

  pointerHeight = signal<number>(48);

  ngAfterViewInit(): void {
    if (this.step().route) {
      this.router.navigate([this.step().route]).then();
    }
    this.findHostElement();
    if (this.hostElement) {
      this.renderer.setStyle(this.hostElement, 'pointer-events', 'none');
      this.computeStyles();
    }
    if (this.step().specificBackground) {
      this.decideForBackground();
    }
  }

  findHostElement(): void {
    if (this.step().selectorElement.selectorType === 'class') {
      this.hostElement = document.getElementsByClassName(this.step().selectorElement.selector)[0] as HTMLElement;
    } else {
      this.hostElement = document.getElementById(this.step().selectorElement.selector) as HTMLElement;
    }
  }

  computeStyles(): void {
    this.findZIndex();
    setTimeout(() => {
      this.findPosition();
      this.findPointerPosition();
    }, 100);
  }

  findZIndex(): void {
    const hostElementStyles = getComputedStyle(this.hostElement);
    if (!Object.prototype.hasOwnProperty.call(this.walkthroughService.baseZIndexes, this.step().selectorElement.selector)) {
      this.walkthroughService.baseZIndexes[this.step().selectorElement.selector] = hostElementStyles.zIndex;
    } else {
      this.prevZIndex = this.walkthroughService.baseZIndexes[this.step().selectorElement.selector];
    }

    const hostPosition = hostElementStyles.position;
    if (hostPosition === 'static') {
      this.renderer.setStyle(this.hostElement, 'position', 'relative');
    }
    this.renderer.setStyle(this.hostElement, 'z-index', this.globalConfig().baseZIndex + 1);
  }

  findPosition(): void {
    if (this.walkThroughStep()) {
      if (this.step().maxHeight) {
        this.renderer.setStyle(this.hostElement, 'maxHeight', this.step().maxHeight);
        this.renderer.setStyle(this.hostElement, 'overflow', 'hidden');
      }
      let posValue;

      if (this.step().position === 'bottom') {
        this.hostElement.scrollIntoView({ block: 'end' });
        posValue = this.hostElement.offsetTop + this.hostElement.clientHeight + 12 + 'px';
        this.renderer.setStyle(this.walkThroughStep()?.nativeElement, 'top', posValue);
      } else if (this.step().position === 'top') {
        if (!this.step().scrollToAbsolutePosition) {
          this.hostElement.scrollIntoView({ block: 'end' });
          posValue = this.hostElement.offsetTop - this.walkThroughStep()?.nativeElement.clientHeight - 12 + 'px';
          this.renderer.setStyle(this.walkThroughStep()?.nativeElement, 'top', posValue);
        } else {
          let scrollContainer: HTMLElement;
          if (this.step().scrollContainer?.selectorType === 'id') {
            scrollContainer = document.getElementById(String(this.step().scrollContainer?.selector)) as HTMLElement;
          } else {
            scrollContainer = document.getElementsByClassName(String(this.step().scrollContainer?.selector))[0] as HTMLElement;
          }
          scrollContainer.scrollTo(0, this.hostElement?.getBoundingClientRect().top);
          posValue = this.hostElement.clientHeight + this.pointerHeight() + 'px';
          this.renderer.setStyle(this.walkThroughStep()?.nativeElement, 'bottom', posValue);
        }
      }
    }
  }

  findPointerPosition(): void {
    if (this.step().pointerStickElement) {
      const stickElement = document.querySelector(this.step().pointerStickElement as string) as HTMLElement;
      const positionX =
        stickElement?.getBoundingClientRect().x - this.hostElement?.getBoundingClientRect().x + stickElement?.clientWidth / 2 - 20;
      if (stickElement) {
        this.renderer.setStyle(this.anchor()?.nativeElement, 'left', positionX + 'px');
      }
    } else if (this.step().rightPointerPosition) {
      this.renderer.setStyle(this.anchor()?.nativeElement, 'right', this.step().rightPointerPosition + 'px');
    } else {
      this.renderer.setStyle(this.anchor()?.nativeElement, 'left', '50%');
    }
    setTimeout(() => {
      this.initialized.set(true);
    }, 100);
  }

  decideForBackground(): void {
    this.globalBackground = this.walkthroughService.config().background;
    this.walkthroughService.config.set({
      ...this.walkthroughService.config(),
      background: this.step().specificBackground as 'lighter' | 'darker',
    });
  }

  goNext(): void {
    this.walkthroughService.goNext();
    this.findNextStep('next');
  }

  goPrev() {
    this.walkthroughService.goPrev();
    this.findNextStep('prev');
  }

  doneWalkThrough(): void {
    this.step().isActive.set(false);
    this.walkthroughService.done();
  }

  findNextStep(direction: 'next' | 'prev'): void {
    if (direction === 'next') {
      this.nextStep = this.walkthroughService
        .config()
        .steps()
        .find((s) => s.id === this.step().id + 1) as WalkThroughStep;
    } else {
      this.nextStep = this.walkthroughService
        .config()
        .steps()
        .find((s) => s.id === this.step().id - 1) as WalkThroughStep;
    }
  }

  ngOnDestroy(): void {
    if (this.hostElement) {
      if (!this.nextStep || this.nextStep.selectorElement.selector !== this.step().selectorElement.selector) {
        this.renderer.setStyle(this.hostElement, 'z-index', this.prevZIndex);
        this.renderer.setStyle(this.hostElement, 'pointer-events', 'unset');
        if (this.step().maxHeight) {
          this.renderer.setStyle(this.hostElement, 'maxHeight', 'unset');
          this.renderer.setStyle(this.hostElement, 'overflow', 'unset');
        }
      }
    }
    if (this.step().specificBackground) {
      this.walkthroughService.config.set({
        ...this.walkthroughService.config(),
        background: this.globalBackground as 'lighter' | 'darker',
      });
    }
  }
}
