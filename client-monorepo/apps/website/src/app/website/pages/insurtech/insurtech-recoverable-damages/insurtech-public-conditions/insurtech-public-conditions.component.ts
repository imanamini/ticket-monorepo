import {Component, inject, input} from '@angular/core';
import {RecoverableDamages} from '../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import {NgIf} from '@angular/common';
import {NgxButtonComponent} from '@digipay/ngx-button';
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-insurtech-public-conditions',
  templateUrl: './insurtech-public-conditions.component.html',
  styleUrls: ['./insurtech-public-conditions.component.scss'],
  standalone: true,
  imports: [NgIf, NgxButtonComponent],
})
export class InsurtechPublicConditionsComponent {
  recoverableDamages = input<RecoverableDamages>();
  urlService = inject(UrlService);

  navigateToExternalLink(url: string): void {
    if (url) {
      this.urlService.handleLink(url)
    }
  }
}
