import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../../../credit-environment.interface';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'app-credit-store-card',
  templateUrl: './credit-store-card.component.html',
  styleUrls: ['./credit-store-card.component.scss'],
  standalone: true,
  imports: [ApiImageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStoreCardComponent {
  storeInfo = input<any>();
  public creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  imageId = computed(() => {
    const logoImageId = this.storeInfo()?.logoImageId;
    if (!logoImageId) return '';
    return this.isPillar ? `${logoImageId}` : logoImageId;
  });
}
