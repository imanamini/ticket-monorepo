import {ChangeDetectionStrategy, Component, inject, Inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AnimationLoader, AnimationOptions, LottieComponent, provideLottieOptions} from "ngx-lottie";
import {TapsiCabTemplateData} from "../../../../../api/clients/models/templates/tapsi-cab/tapsi-cab-template-data";
import {DomSanitizer} from "@angular/platform-browser";
import {delay, of} from "rxjs";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../../services/url.service";
import player from 'lottie-web/build/player/lottie_light';

@Component({
  selector: 'app-tapsi-intro',
  standalone: true,
  imports: [CommonModule, LottieComponent, NgxButtonComponent],
  templateUrl: './tapsi-intro.component.html',
  styleUrl: './tapsi-intro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AnimationLoader,
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class TapsiIntroComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/images/tapsi-cab/tapsi-car.json',
    loop: true,
    autoplay: true,
  };

  loadedCar = signal(false);
  isLoaded = signal(false);
  isMobile = signal(false);

  templateData = input<TapsiCabTemplateData | null>(null);

  private urlService = inject(UrlService);

  constructor(private sanitizer: DomSanitizer, @Inject(PLATFORM_ID) private platformId: string) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile.set(window.innerWidth <= 1280);
    }

    // Show scene first
    of('').pipe(delay(0)).subscribe(() => {
      this.isLoaded.set(true);
    });

    // Then show car with animation after a brief delay
    of('').pipe(delay(100)).subscribe(() => {
      this.loadedCar.set(true);
    });
  }

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  openLink(url: string) {
    this.urlService.handleLink(url)
  }
}
