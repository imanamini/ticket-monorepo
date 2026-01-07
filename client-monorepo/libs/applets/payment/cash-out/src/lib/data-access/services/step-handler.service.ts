import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StepContract } from '../models/step-contract';
import { PagePathEnum } from '../models/page.enum';
import { ParentType } from '../models/parent.model';
import { getParentSource } from '../../components/card-transfer-module/cash-out-page/utiles/storage';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Injectable({
  providedIn: 'root',
})
export class StepHandlerService extends StepContract {
  private router = inject(Router);
  private location = inject(Location);
  private backHandler = inject(BackHandlerService);
  public back(): void {
    this.backHandler.goBack();
  }

  public exit(): void {
    // this.navigate(PagePathEnum.SETTING);
  }

  public goTo(page: PagePathEnum): void {
    if (page === PagePathEnum.CHOOSE_AMOUNT) {
      const parent: ParentType = getParentSource();
      switch (parent) {
        case 'wallet-transfer':
          this.navigate(PagePathEnum.WALLET_TRANSFER_CHOOSE_AMOUNT);
          break;

        case 'setting':
        case 'none':
        default:
          this.navigate(PagePathEnum.CHOOSE_AMOUNT);
          break;
      }
      return;
    }
    this.navigate(page);
  }

  private navigate(path: PagePathEnum): void {
    this.router.navigate([path]);
  }
}
