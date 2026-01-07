import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-sale-promotion',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './sale-promotion.component.html',
  styleUrl: './sale-promotion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SalePromotionComponent {
  @Input() templateData!: any;

  urlService = inject(UrlService);

  openLink(link : string){
    this.urlService.handleLink(link);
  }
}
