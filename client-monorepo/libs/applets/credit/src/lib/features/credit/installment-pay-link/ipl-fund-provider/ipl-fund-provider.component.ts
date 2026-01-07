import { Component, computed, inject, input } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';

@Component({
  selector: 'app-ipl-fund-provider',
  standalone: true,
  imports: [ApiImageModule],
  templateUrl: './ipl-fund-provider.component.html',
})
export class IplFundProviderComponent {
  businessId = input.required<string>();
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  imageId = computed(() => {
    const id = this.businessId();
    if (!id) return '';
    return this.isPillar ? `${id}` : id;
  });
}
