import { ChangeDetectionStrategy, Component, inject, Inject, signal } from '@angular/core';
import { CreditUrlService } from '../../data-access/utils/url';
import { Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditRouteStateInterface } from '../../data-access/services/route-state/credit-route-state.interface';
import { CreditTacService } from '../credit-tac.service';
import { CreditPageDialogComponent } from '../../components/credit-page-dialog/credit-page-dialog.component';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Dir } from '@angular/cdk/bidi';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-wallet-activated',
  templateUrl: './wallet-activated.component.html',
  styleUrls: ['./wallet-activated.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent, Dir, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletActivatedComponent {
  wallet = signal<CreditWallet | null>(null);
  title = signal<string | null>(null);
  description = signal<string | null>(null);
  creditHomeUrl = signal<string | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);
  creditService = inject(CreditApiService);
  creditTacService = inject(CreditTacService);
  creditUrlService = inject(CreditUrlService);

  constructor(
    @Inject('RouteStateInterface')
    private routeStateService: CreditRouteStateInterface,
  ) {
    this.creditHomeUrl.set(this.creditUrlService.getInnerServicePath('/overview'));
    const state = this.routeStateService.getAll();
    if (!state.wallet) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
      return;
    }

    this.wallet.set(state.wallet);
    this.title.set(state.title || '');
    this.description.set(state.description || '');
  }

  goToWalletDetailsPage() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${this.wallet()?.creditId}`));
  }

  infoClicked() {
    this.creditTacService.getData().subscribe((r) => {
      this.creditService.getTacPage(r).subscribe((html) => {
        this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
          title: r.title,
          html,
          pageId: '',
        });
      });
    });
  }
}
