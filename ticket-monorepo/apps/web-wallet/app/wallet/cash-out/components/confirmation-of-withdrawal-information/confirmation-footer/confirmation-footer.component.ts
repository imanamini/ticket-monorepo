import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PATH } from '../../../consts/cash-out-paths.const';
import {ActivatedRoute, Router} from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ConfirmationOfWithdrawalInformationComponent } from '../confirmation-of-withdrawal-information.component';
import { CashOutProcessService } from '../../../services/cash-out-process.service';

@Component({
  selector: 'confirmation-footer',
  templateUrl: './confirmation-footer.component.html',
  styleUrls: ['./confirmation-footer.component.scss']
})
export class ConfirmationFooterComponent {
  public loadingApi = false;
  private router = inject(Router);
  private bottomSheetRef = inject(MatBottomSheetRef<ConfirmationOfWithdrawalInformationComponent>);
  private cashOutProcessService = inject(CashOutProcessService);
  private activatedRoute = inject(ActivatedRoute);

  public editAmount(): void {
    this.router.navigate([PATH.chooseAmount]);
    this.router.navigate(['../'+ PATH.chooseAmount], { relativeTo: this.activatedRoute });
    this.bottomSheetRef.dismiss();
  }

  public register(): void {
    this.loadingApi = true;
    this.cashOutProcessService.register()
      .then(() => {
        this.loadingApi = false;
        this.bottomSheetRef.dismiss();
      })
      .catch(() => {
        this.loadingApi = false;
      });
  }
}
