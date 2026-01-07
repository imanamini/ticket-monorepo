import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-app-banners-location-base-banner',
  standalone: true,
  imports: [CommonModule, LottieComponent, DpIconComponent, NgxButtonComponent],
  templateUrl: './location-base-banner.component.html',
  styleUrl: './location-base-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class LocationBaseBannerComponent implements AfterViewChecked, OnInit, OnDestroy {
  observer!: IntersectionObserver;
  threshold = input<number>(0.5);
  animation = signal<any>(undefined);
  lottieConfig = {
    path: '/assets/map/location-base.json',
    autoplay: true,
    loop: true,
  };

  constructor(private elementRef: ElementRef) {}

  ngAfterViewChecked() {
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnInit() {
    this.innitIntersection();
  }

  innitIntersection(): void {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= this.threshold()) {
            if (this.animation()) {
              this.animation().play();
            }
          } else {
            this.animation().pause();
          }
        });
      },
      {
        threshold: this.threshold(),
      },
    );
  }
  ngOnDestroy() {
    this.observer.unobserve(this.elementRef.nativeElement);
    this.observer?.disconnect();
  }

  handleAnimation(animation: any): void {
    this.animation.set(animation);
  }
}
