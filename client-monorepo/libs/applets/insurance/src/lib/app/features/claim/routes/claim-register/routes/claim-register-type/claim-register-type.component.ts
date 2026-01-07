import { Component } from '@angular/core';
import { HeaderTitlePositionEnum } from '../../../../../../data-access/enums/header-title-position.enum';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { ClaimCardComponent } from '../../../../partials/card/claim-card.component';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'claim-register-type',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ClaimCardComponent
  ],
  templateUrl: './claim-register-type.component.html',
  styleUrl: './claim-register-type.component.scss'
})
export class ClaimRegisterTypeComponent {

  constructor(private router: Router,
              private messageService: MessageService,
  ) {
  }

  protected readonly HeaderTitlePositionEnum = HeaderTitlePositionEnum;
  isChecked = false;

  handleActiveClicked(): void {
    if (this.isChecked) {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/policy`]).then();
    } else {
      this.messageService.showErrorMessage('لطفا نوع بیمه نامه خود را انتخاب کنید');
    }
  }

  handleChecked(ev: any): void {
    this.isChecked = ev;
  }
}
