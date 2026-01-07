import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgStyle } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ui-loading-dots',
  templateUrl: './ui-loading-dots.component.html',
  styleUrls: ['./ui-loading-dots.component.scss'],
  standalone: true,
  imports: [NgStyle],
})
export class UiLoadingDotsComponent implements OnInit, OnDestroy {
  @Input()
  size = 6;

  @Input()
  color = '#fff';

  @Input()
  opacity = 0.3;

  active = 1;

  destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startInterval();
    }
  }

  startInterval() {
    interval(300)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.active + 1 <= 3) {
          this.active += 1;
        } else {
          this.active = 1;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
