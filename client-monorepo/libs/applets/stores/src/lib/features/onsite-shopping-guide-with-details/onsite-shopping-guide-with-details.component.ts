import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { ONSITE_SHOPPING_GUIDE } from '../../data-access/constants/onsite-shopping-guide.constant';
import { OnsiteShoppingGuideConfig } from '../../data-access/models/onsite-shopping-guide.config';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { TitleSummaryComponent, VideoPlayerComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'stores-applet-onsite-shopping-guide-with-details',
  standalone: true,
  imports: [
    CommonModule,
    NgxSegmentedControlComponent,
    NgxAppBarComponent,
    NgxButtonComponent,
    NgxCalloutComponent,
    TitleSummaryComponent,
    RouterLink,
    VideoPlayerComponent,
  ],

  templateUrl: './onsite-shopping-guide-with-details.component.html',
  styleUrl: './onsite-shopping-guide-with-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnsiteShoppingGuideWithDetailsComponent implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  bottomNavigationService = inject(NgxBottomNavigationService);
  location = inject(Location);
  videoStyles = {
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '24px',
  };
  options: SegmentItemsModel[] = [
    { text: 'کیوآر کد', id: 'qr', value: 'qr', icon: 'qr-scan', iconType: 'linear' },
    { text: 'بارکد', id: 'barcode', value: 'barcode', icon: 'barcode-scan', iconType: 'linear' },
    { text: 'کارت‌خوان', id: 'pos', value: 'pos', icon: 'bank-card-2', iconType: 'linear' },
  ];
  selectedMethod = signal<SegmentItemsModel>(this.options[0]);
  config = computed<OnsiteShoppingGuideConfig>(() => ONSITE_SHOPPING_GUIDE[this.selectedMethod().id]);
  initialized = signal(false);
  protected readonly SHOPPING_GUIDE = ONSITE_SHOPPING_GUIDE;

  ngOnInit(): void {
    this.initializeMethod();
    this.bottomNavigationService.hide();
  }

  initializeMethod(): void {
    const paymentTypes = this.activatedRoute.snapshot.paramMap.get('methods');
    if (paymentTypes) {
      const firstPaymentType = paymentTypes.split(',');
      if (firstPaymentType) {
        const segmentItem = this.options.find((item) => item.id === firstPaymentType[0]);
        if (segmentItem) {
          this.selectedMethod.set(segmentItem);
        }
      }
    }
    this.initialized.set(true);
  }

  changeSelectedMode(item: SegmentItemsModel): void {
    this.selectedMethod.set(item);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
