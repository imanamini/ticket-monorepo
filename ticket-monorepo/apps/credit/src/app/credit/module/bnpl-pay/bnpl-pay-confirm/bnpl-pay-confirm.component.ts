import { Component, computed, inject, Inject, OnInit, signal, viewChild } from '@angular/core';
import { CancelService } from '../../../shared/services/cancel.service';
import { CreditRouteStateInterface } from '../../../core/services/route-state/credit-route-state.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { isMobileOrTablet } from '../../../../utils/device';
import { numberToLetter } from '../../../../utils/strings';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { CreditWallet } from '../../../api/purchase/credit-wallet.model';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-bnpl-pay-confirm',
  templateUrl: './bnpl-pay-confirm.component.html',
  styleUrls: ['./bnpl-pay-confirm.component.scss']
})
export class BnplPayConfirmComponent implements OnInit {
  state = signal<null | { creditDetails: CreditWallet[] }>(null);
  ticket = signal<string>('');
  isDesktop = signal<boolean>(false);
  fundProviderTitle = computed(() => this.state().creditDetails[0].fundProvider.title);
  fundProviderBusinessId = computed(() => this.state().creditDetails[0].fundProvider.businessId);
  creditId = computed<string>(() => this.state().creditDetails[0].creditId);
  balance = computed(() => this.state().creditDetails[0].balance);
  installmentCount = computed(() => this.state().creditDetails[0].installmentCount);
  settleTitle = computed(() => numberToLetter(this.installmentCount(), 10) + ' قسط');
  loading = signal(true);

  creditPayService = inject(CreditPayService);

  countdown = viewChild<CountdownComponent>('cd');

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private cancelService: CancelService,
    @Inject('RouteStateInterface') private routeStateService: CreditRouteStateInterface,
  ) {
    this.setTicketFromUrl();
    this.state.set(this.routeStateService.getAll());
    if (!this.state().creditDetails) {
      this.creditPayService.getTicketInfo().then(res => {
        this.state.set(res);
        this.loading.set(false);
      });
      return;
    }
    this.loading.set(false);
  }

  ngOnInit(): void {
    this.isDesktop.set(!isMobileOrTablet());
  }

  setTicketFromUrl() {
    this.ticket.set(this.activatedRoute.snapshot.paramMap.get('ticket'));
    this.storage.set({
      ticket: this.ticket(),
    });
  }

  onBack() {
    this.countdown().pause();
    this.cancelService.confirmBottomSheet().then(res => {
      if (res === 'abort') {
        this.countdown().resume();
      }
    });
  }

  onConfirm() {
    this.router.navigate([
      'bnpl-pay/details',
      this.ticket(),
      this.fundProviderBusinessId(),
      this.creditId(),
    ]);
  }
}
