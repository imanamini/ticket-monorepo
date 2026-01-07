import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { TERMS_AND_CONDITIONS_CARD_CONFIG } from '../../data-access/consts/tac-card-config';
import { removeBaseUrl } from '../../utils/remove-base-url';
import * as Sentry from '@sentry/angular-ivy';
import { PaymentCheckoutApiService } from '../../data-access/services/payment-checkout-api.service';
import { PageManagementService } from '../../data-access/services/page-management.service';
import { HandleErrorService } from '../../data-access/services/handle-error.service';
import { TacResponse } from '@client-monorepo/common/user';
import { PageEnum } from '../../data-access/models/page.enum';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'payment-checkout--tac',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './tac.component.html',
  styleUrls: ['./tac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TacComponent implements OnInit, OnDestroy {
  public termsAndConditionHtmlText: SafeHtml | null = null;
  public cardConfig: Partial<CardConfigInterface> = TERMS_AND_CONDITIONS_CARD_CONFIG;
  private subscription: Subscription = new Subscription();
  private ticket = signal('');
  loadingSubmit = signal(false);
  private paymentCheckoutApiService = inject(PaymentCheckoutApiService);
  private sanitizer = inject(DomSanitizer);
  private activatedRoute = inject(ActivatedRoute);
  private pageManagementService = inject(PageManagementService);
  private handleErrorService = inject(HandleErrorService);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }
  ngOnInit() {
    const ticketParam = this.activatedRoute.snapshot.queryParams['ticket'];
    this.ticket.set(ticketParam);
    this.checkTacState();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private checkTacState(): void {
    this.paymentCheckoutApiService.tac(this.ticket()).subscribe((response: TacResponse) => {
      if (response.shouldAcceptTac) {
        this.getTacHtml(response.tacUrl);
      } else {
        this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
      }
    });
  }

  private getTacHtml(url: string): void {
    const updatedUrl = removeBaseUrl(url);
    this.subscription = this.paymentCheckoutApiService.getHtml(updatedUrl, { ticket: this.ticket() }).subscribe((response) => {
      this.termsAndConditionHtmlText = this.sanitizer.bypassSecurityTrustHtml(
        response.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`),
      );
    });
  }

  public accept(): void {
    this.loadingSubmit.set(true);
    this.paymentCheckoutApiService
      .tacAccept(this.ticket())
      .pipe(finalize(() => this.loadingSubmit.set(false)))
      .subscribe(
        () => {
          this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
        },
        (error: ApiResultInterface) => {
          this.handleErrorService.check(error);
        },
      );
  }
}
