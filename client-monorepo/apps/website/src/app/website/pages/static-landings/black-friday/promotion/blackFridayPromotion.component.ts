import {ChangeDetectionStrategy, Component, Inject, inject, input, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-black-friday-promotion',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './blackFridayPromotion.component.html',
  styleUrl: './blackFridayPromotion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayPromotionComponent {
  promotion = input<{
    narrowTitle: string | null,
    boldTitle: string | null,
    subtitle: string | null,
    image: ApiFile | null,
    cta: {
      title: string | null,
      link: string | null
    } | null
  }>();

  urlService = inject(UrlService);
  mobileMode = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) public platformID: string) {
  }

  openLink(url: string) {
    this.urlService.handleLink(url)
  }
}
