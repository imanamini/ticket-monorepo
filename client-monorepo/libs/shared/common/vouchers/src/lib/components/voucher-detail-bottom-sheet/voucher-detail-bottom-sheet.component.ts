import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Voucher } from '../../data-access/models/voucher.model';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'common-vouchers-voucher-detail-bottom-sheet',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxButtonComponent, NgxBottomSheetHeaderComponent, NgxTooltipDirective, PipesModule, PipesModule],
  templateUrl: './voucher-detail-bottom-sheet.component.html',
  styleUrl: './voucher-detail-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoucherDetailBottomSheetComponent implements OnInit {
  bottomSheetService = inject(NgxBottomSheetService);
  actionHandler = inject(ActionHandlerService);
  eventManager = inject(EventManagementService);

  voucher = computed<Voucher>(() => this.bottomSheetService.data().voucher);
  expirationDate = computed(() => new Date(this.voucher().expirationDate));

  routeUrl: 'stores' | 'store-details' | '' = '';
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.computeUrl();
  }

  copyVoucherCode(): void {
    const code = this.voucher().code;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    this.sendCopyEvent();
  }

  computeUrl(): void {
    const url = this.activatedRoute.snapshot.queryParamMap.get('mode');
    if (url) {
      this.routeUrl = 'stores';
    } else {
      this.routeUrl = 'store-details';
    }
  }

  goToExternalWebsite() {
    const redirectUrl = this.voucher().store?.url;
    if (redirectUrl) {
      this.sendRedirectEvent(redirectUrl);
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          type: RedirectionTypeEnum.blank,
          url: redirectUrl,
          params: {
            external: true,
            'dp-source': 'DP',
            'dp-medium': 'voucher-carousel',
            'dp-type': 'merchant',
          },
        },
      });
    }
  }

  sendCopyEvent(): void {
    this.eventManager.triggerEvent({
      eventType: 'custom',
      data: {
        key: 'voucher_id',
        value: this.routeUrl + '_' + this.voucher().voucherId,
      },
    });
  }

  sendRedirectEvent(redirectUrl: string): void {
    this.eventManager.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: redirectUrl,
          to: redirectUrl,
        },
        meta: `storeTrackingCode:${this.voucher().store?.trackingCode}`,
        breadCrumbs: [this.routeUrl, 'voucher-carousel', 'voucher-detail'],
      },
      true,
    );
  }
}
