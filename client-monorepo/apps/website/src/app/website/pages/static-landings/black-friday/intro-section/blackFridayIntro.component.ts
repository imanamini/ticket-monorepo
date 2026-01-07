import {ChangeDetectionStrategy, Component, Inject, inject, input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BlackFridayTimerComponent} from "../timer/blackFridayTimer.component";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../../services/url.service";
import {ScrollToAnchorDirective} from "../../../../../ui/ui-directive/scroll-to-anchor.directive";

@Component({
  selector: 'app-black-friday-intro',
  standalone: true,
  imports: [CommonModule, BlackFridayTimerComponent, NgxButtonComponent, ScrollToAnchorDirective],
  templateUrl: './blackFridayIntro.component.html',
  styleUrl: './blackFridayIntro.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayIntroComponent implements OnInit {

  introSection = input<{
    title: string,
    subtitle: string,
    primaryCta: {
      link: string,
      title: string
    },
    secondaryCta: {
      link: string,
      title: string
    },
    deadline: number
  }>();
  urlService = inject(UrlService);

  mobileMode = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) public platformID: string) {
  }

  openLink(url: string) {
    this.urlService.handleLink(url);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }


}
