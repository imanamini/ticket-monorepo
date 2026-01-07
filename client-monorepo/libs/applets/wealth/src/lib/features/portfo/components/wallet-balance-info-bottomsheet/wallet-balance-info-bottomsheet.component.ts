import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IIntroductionData } from '../../../funds/funds-list/models/introduction.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PORTFO } from '../../../../data-access/constants/app-routes';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-balance-info-bottomsheet',
  standalone: true,
  imports: [PipesModule, NgxButtonComponent],
  templateUrl: './wallet-balance-info-bottomsheet.component.html',
  styleUrl: './wallet-balance-info-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceInfoBottomsheetComponent implements OnInit {
  data = signal<IIntroductionData | undefined>(undefined);

  private bottomSheet = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit() {
    this.data.set(this.bottomSheet.data().data);
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }

  displayPortfolio() {
    this.close();
    this.navigationService.navigate([PORTFO]);
  }
}
