import { ChangeDetectionStrategy, Component, contentChildren, effect, input, OnDestroy, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, animation, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { AnimatedListDirective } from './animated-list.directive';

// Define spring animation
const springAnimation = animation(
  animate(
    '{{ duration }}ms cubic-bezier(0.25, 0.1, 0.25, 1.0)', // Using a standard ease curve for smoother animation
    style({ transform: 'translateY({{ y }})' }),
  ),
  { params: { y: '0%' } },
);

@Component({
  selector: 'common-ui-components-animated-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-list.component.html',
  styleUrl: './animated-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideAnimation', [
      state(
        'visible',
        style({
          transform: 'translateY(0)',
        }),
      ),
      state(
        'hidden',
        style({
          transform: 'translateY(100%)',
        }),
      ),
      state(
        'hidingToTop',
        style({
          transform: 'translateY(-100%)',
        }),
      ),
      state(
        'showingFromBottom',
        style({
          transform: 'translateY(0)',
        }),
      ),
      transition('visible => hidingToTop', [
        useAnimation(springAnimation, {
          params: { duration: '{{ duration }}', y: '-100%' },
        }),
      ]),

      transition('hidden => showingFromBottom', [
        useAnimation(springAnimation, {
          params: { duration: '{{ duration }}', y: '0%' },
        }),
      ]),
    ]),
  ],
})
export class AnimatedListComponent implements OnDestroy {
  // Content
  items = contentChildren<AnimatedListDirective>(AnimatedListDirective);

  // Inputs
  classes = input<string>('');
  animationDuration = input<number>(100);
  changeInterval = input<number>(1000);
  containerStyle = input<{ [key: string]: string }>({});

  // Variables
  currentIndex = signal(0);
  nextIndex = signal(1);
  currentIconState = signal<string>('visible');
  nextIconState = signal<string>('hidden');

  private animationInterval!: NodeJS.Timeout;
  constructor() {
    effect(
      () => {
        if (this.items().length > 1) {
          // Initialize next icon index
          untracked(() => {
            this.nextIndex.set((this.currentIndex() + 1) % this.items().length);
          });
          this.startAnimation();
        }
      },
      { allowSignalWrites: true },
    );
  }

  startAnimation() {
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
    }

    this.animationInterval = setInterval(() => {
      this.nextIconState.set('hidden');

      this.nextIconState.set('showingFromBottom');

      this.currentIconState.set('hidingToTop');

      setTimeout(() => {
        const newCurrentIndex = this.nextIndex();
        const newNextIndex = (newCurrentIndex + 1) % this.items().length;

        this.currentIndex.set(newCurrentIndex);
        this.nextIndex.set(newNextIndex);

        this.currentIconState.set('visible');
        this.nextIconState.set('hidden');
      }, this.animationDuration());
    }, this.changeInterval());
  }

  ngOnDestroy() {
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
    }
  }
}
