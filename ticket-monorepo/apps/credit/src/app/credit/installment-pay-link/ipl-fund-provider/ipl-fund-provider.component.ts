import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'app-ipl-fund-provider',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ApiImageModule,
  ],
  templateUrl: './ipl-fund-provider.component.html',
})
export class IplFundProviderComponent {
  businessId = input.required<string>();
}
