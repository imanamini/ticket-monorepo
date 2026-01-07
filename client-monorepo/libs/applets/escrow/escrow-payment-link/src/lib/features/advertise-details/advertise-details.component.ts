import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentLinkSaleAdInfo } from '../../data-access/model/payment-link-create.model';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'escrow-payment-link-advertise-details',
  standalone: true,
  imports: [
    CommonModule,
    NgxAppBarComponent,
    TitleSummaryComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    NgxDividerComponent,
  ],
  templateUrl: './advertise-details.component.html',
  styleUrl: './advertise-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EscrowStorageService],
})
export class AdvertiseDetailsComponent implements OnInit {
  advertiseItem = signal<PaymentLinkSaleAdInfo | undefined>(undefined);
  isLoading = computed(() => !this.advertiseItem());
  storageService = inject(EscrowStorageService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getAdvertiseDetails();
  }

  getAdvertiseDetails() {
    const item = this.storageService.getItem('link-item') as PaymentLinkSaleAdInfo;
    if (item) {
      this.advertiseItem.set(item);
    }
  }

  goBack() {
    const linkId = this.activatedRoute.snapshot.queryParams['linkId'];
    console.log(linkId);
    this.router.navigate(['/payment-link/user/detail'], { queryParams: { linkId } });
  }
  protected readonly BorderColorsEnum = BorderColorsEnum;

}
