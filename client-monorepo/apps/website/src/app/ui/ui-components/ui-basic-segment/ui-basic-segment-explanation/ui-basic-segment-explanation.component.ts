import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import { UiBasicSegmentComponent } from '../ui-basic-segment/ui-basic-segment.component';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import player from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'app-ui-basic-segment-explanation',
  templateUrl: './ui-basic-segment-explanation.component.html',
  styleUrls: ['./ui-basic-segment-explanation.component.scss'],
  standalone: true,
  imports: [NgIf, UiBasicSegmentComponent, LottieComponent, NgFor, UiButtonComponent, NgOptimizedImage],
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class UiBasicSegmentExplanationComponent {
  @Input()
  animationPath: string;

  @Input()
  data: any;

  @Input()
  rtl = false;

  @Output()
  cta: EventEmitter<boolean> = new EventEmitter();
}
