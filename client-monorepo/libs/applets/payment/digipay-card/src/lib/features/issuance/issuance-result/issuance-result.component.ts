import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AnimationLoader, LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web/build/player/lottie_light';
                 
@Component({
  selector: 'digipay-card-applet-issuance-result',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxButtonComponent, LottieComponent],
  templateUrl: './issuance-result.component.html',
  styleUrl: './issuance-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class IssuanceResultComponent {
  router = inject(Router);
  animationPath = 'assets/digipay-card/result-slider.json';
  onNavigate() {
    this.router.navigateByUrl('/transactions');
  }
}
