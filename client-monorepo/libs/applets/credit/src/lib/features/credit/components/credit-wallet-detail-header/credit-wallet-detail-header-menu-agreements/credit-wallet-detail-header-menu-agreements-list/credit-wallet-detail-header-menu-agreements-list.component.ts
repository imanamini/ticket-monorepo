import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CreditAgreementModel } from '../../../../data-access/models/credit/agreements/credit-agreement.model';
import { CreditAgreementTypeMapper } from '../../../../data-access/models/credit/agreements/credit-agreement-type';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-wallet-detail-header-menu-agreements-list',
  templateUrl: './credit-wallet-detail-header-menu-agreements-list.component.html',
  styleUrls: ['./credit-wallet-detail-header-menu-agreements-list.component.scss'],
  standalone: true,
  imports: [PipesModule, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailHeaderMenuAgreementsListComponent {
  agreements = input<CreditAgreementModel[]>();

  agreementClicked = output<CreditAgreementModel>();

  goMainClicked = output<void>();

  protected readonly CreditAgreementTypeMapper = CreditAgreementTypeMapper;

  goMain() {
    this.goMainClicked.emit();
  }

  onAgreementHandler(agreement: CreditAgreementModel) {
    this.agreementClicked.emit(agreement);
  }
}
