import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'common-ui-loading-dots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-loading-dots.component.html',
  styleUrls: ['./ui-loading-dots.component.scss'],
})
export class UiLoadingDotsComponent implements OnInit, OnDestroy {
  @Input()
  size = 6;

  @Input()
  color = '#fff';

  @Input()
  opacity = 0.3;

  active = signal(1);
  interval!: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.interval = setInterval(() => {
      const next = (this.active() % 3) + 1;
      this.active.set(next);
    }, 300);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
