import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-image-slider-vertical',
  templateUrl: './image-slider-vertical.component.html',
  styleUrls: ['./image-slider-vertical.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
})
export class ImageSliderVerticalComponent implements OnInit, OnDestroy {
  activeArtIndex: number | null = 0;

  @Input()
  images: any | null = null;

  private destroy$ = new Subject<void>();

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if (this.platformId.toUpperCase() === 'SERVER') {
      return;
    }

    interval(4000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.activeArtIndex === null) {
          this.activeArtIndex = 0;
        } else {
          if (this.images.length > 0 && this.activeArtIndex + 1 < this.images.length) {
            this.activeArtIndex += 1;
          } else {
            this.activeArtIndex = 0;
          }
        }
      });
  }
}
