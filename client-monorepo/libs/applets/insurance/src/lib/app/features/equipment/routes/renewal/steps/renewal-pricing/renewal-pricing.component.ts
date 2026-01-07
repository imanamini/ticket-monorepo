import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SharedRenewalService } from '../../services/shared-renewal.service';
import { RenewalApiService } from '../../../../api/services/renewal/renewal-api.service';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { PriceSelectionModel, RenewalPricingInputComponent } from '../../partials/renewal-pricing-input/renewal-pricing-input.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { RenewalInfoBoxComponent } from '../../partials/renewal-info-box/renewal-info-box.component';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import { GetPriceModel } from '../../../../api/models/renewal/get-price.model';
import { SetPriceBodyModel } from '../../../../api/models/pricing/set-price-body.model';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-pricing',
  templateUrl: './renewal-pricing.component.html',
  standalone: true,
  imports: [NgClass, RenewalPricingInputComponent, RenewalInfoBoxComponent, JourneyButtonsComponent, AsyncPipe],
  styleUrls: ['./renewal-pricing.component.scss'],
})
export class RenewalPricingComponent implements OnInit, OnDestroy {
  constructor(
    private service: SharedRenewalService,
    private apiService: RenewalApiService,
    private loadingService: LoadingService,
    private messageService: MessageService,
  ) {}

  @Input()
  journey: JourneyNamesModel;

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  uniqueCode: string;
  isMobile = isMobileOrTablet() || !isDesktop();
  loading$: Observable<boolean> = this.loadingService.getLoading();
  selectedPrice: GetPriceModel;
  selectedInputPrice: PriceSelectionModel;

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.getUniqueCode();
  }

  getPrice(): void {
    this.subscriptions[0] = this.apiService.getPrice(this.uniqueCode).subscribe({
      next: (res) => {
        this.selectedPrice = { ...res.data };
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
  }

  getUniqueCode(): void {
    this.subscriptions[2] = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getPrice();
        }
      },
    });
  }

  setPricing(): void {
    this.loadingService.setLoading(true);
    const pricingId = this.selectedInputPrice.pricingId;
    const price = this.selectedInputPrice.price;
    const body: SetPriceBodyModel = {
      key: this.uniqueCode,
      pricingId: pricingId ? pricingId : null,
      displayPrice: pricingId ? price : null,
      price: price && !pricingId ? Number(price) * 10 : 0,
    };

    this.subscriptions[1] = this.apiService.setPrice(body).subscribe({
      next: (res) => {
        this.service.setStepChangeSubject('NEXT');
      },
      error: (err) => {
        this.messageService.showErrorIfExists(err);
        this.loadingService.setLoading(false);
      },
    });
  }

  handlePriceSelection(event: PriceSelectionModel): void {
    this.selectedInputPrice = event;
  }

  goToNextStep(): void {
    this.setPricing();
  }

  goToPreviousStep(): void {
    this.service.setStepChangeSubject('PREVIOUS');
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false);
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}
