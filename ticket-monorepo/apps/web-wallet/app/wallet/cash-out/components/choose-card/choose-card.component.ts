import { Component, inject } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ConfirmationOfWithdrawalInformationComponent
} from '../confirmation-of-withdrawal-information/confirmation-of-withdrawal-information.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ScreenService } from '../../services/screen.service';
import { PATH } from '../../consts/cash-out-paths.const';
import { AddNewCardComponent } from '../add-new-card/add-new-card.component';
import { CASH_OUT_BOTTOM_SHEET_CONFIG } from '../../consts/cash-out-bottom-sheet.const';
import {CardProfile} from "../../models/card-profile-response.model";

@Component({
  selector: 'choose-card',
  templateUrl: './choose-card.component.html',
  styleUrls: ['./choose-card.component.scss']
})
export class ChooseCardComponent {
  public isLoading: boolean = true;
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  private screenService = inject(ScreenService);
  private activatedRoute = inject(ActivatedRoute);

  public goToConfirmation(selectedCard: CardProfile): void {
    if (this.screenService.detectScreen() === 'MOBILE') {
      this.bottomSheet.open(ConfirmationOfWithdrawalInformationComponent, {
        panelClass: 'cash-out-without-padding'
      });
      return;
    }
    this.router.navigate(['../'+ PATH.confirmation], { relativeTo: this.activatedRoute });
  }

  public goToAddNewCard(): void {
    if (this.screenService.detectScreen() === 'MOBILE') {
      this.bottomSheet.open(AddNewCardComponent, CASH_OUT_BOTTOM_SHEET_CONFIG);
      return;
    }
    this.router.navigate(['../'+ PATH.addCard], { relativeTo: this.activatedRoute });
  }
}
