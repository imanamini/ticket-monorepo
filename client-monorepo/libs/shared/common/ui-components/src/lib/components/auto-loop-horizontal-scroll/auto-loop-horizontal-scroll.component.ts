import { AfterViewInit, ChangeDetectionStrategy, Component, effect, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'common-ui-components-auto-loop-horizontal-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auto-loop-horizontal-scroll.component.html',
  styleUrl: './auto-loop-horizontal-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoLoopHorizontalScrollComponent implements OnInit, AfterViewInit {
  // Inputs
  classes = input<string>('');
  autoScrollSpeed = input<number>(2);
  pageSize = input(10);
  uniqueId = signal<string>('');
  paused = input<boolean>(false);

  constructor() {
    effect(() => {
      this.applyPauseState(this.paused());
    });
  }

  ngOnInit() {
    this.uniqueId.set('auto-loop-swiper-' + Math.floor(Math.random() * 10000));
  }

  ngAfterViewInit(): void {
    this.setAnimationDuration();
  }

  setAnimationDuration(): void {
    const selector = '#' + this.uniqueId() + ' .scroll-content';
    const content = document.querySelector(selector) as HTMLElement;
    if (content) {
      content.style.animationDuration = this.pageSize() * this.autoScrollSpeed() + 's';
    }
  }

  private applyPauseState(isPaused: boolean): void {
    const selector = '#' + this.uniqueId() + ' .scroll-content';
    const content = document.querySelector(selector) as HTMLElement;
    if (content) {
      content.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }
}
