import {
  Component,
  effect,
  EventEmitter,
  HostListener,
  input,
  OnDestroy,
  OnInit,
  output,
  Output,
  signal,
} from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgClass } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, tap } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UsedSelectedCardTypeModel } from '../../models/used-selected-card-type';
import { InsurancePremiumCardComponent } from '../insurance-premium-card/insurance-premium-card.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { CampaignCalculationsService } from '../../services/campaign-calculations.service';

@Component({
  selector: 'used-manual-pricing',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    NgClass,
    PipesModule,
    ReactiveFormsModule,
    InsurancePremiumCardComponent
  ],
  templateUrl: './used-manual-pricing.component.html',
  styleUrl: './used-manual-pricing.component.scss',
})
export class UsedManualPricingComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(private messageService: MessageService,
              private campaignCalculationsService: CampaignCalculationsService
  ) {
    super();
    effect(() => {
      if (this.announcedPrice() && this.isActive()) {
        this.price.setValue(this.announcedPrice() / 10);
      }
    });
  }

  uniqueCode = input.required<string>();
  announcedPrice = input.required<number>();

  @Output()
  activeChanged: EventEmitter<UsedSelectedCardTypeModel> =
    new EventEmitter<UsedSelectedCardTypeModel>();

  @Output()
  priceChange: EventEmitter<string> = new EventEmitter<string>();

  wageAmount = 0;
  campaignWageAmount = 0;
  campaignDiscount = 0;
  price = new FormControl<number>(null, [
    Validators.required,
    Validators.min(1_000_000),
    Validators.max(200_000_000)]);
  isActive = input.required<boolean>();
  isPriceValid = output<boolean>();
  isLoadingGetPricing = signal<boolean>(false);

  @HostListener('click', ['$event']) onClick(event: Event): void {
    this.handleClick();
  }

  ngOnInit(): void {
    this.subscribeOnPriceChanges();
    this.setAnnouncedPrice();
  }

  setAnnouncedPrice(): void {
    if (this.announcedPrice()) {
      this.priceChange.emit(this.announcedPrice.toString());
    }
  }

  subscribeOnPriceChanges(): void {
    const subscription = this.price.valueChanges
      .pipe(
        tap(() => {
          this.isLoadingGetPricing.set(this.price.valid);
          if (this.isLoadingGetPricing()) {
            this.isPriceValid.emit(false);
          } else {
            this.isPriceValid.emit(this.price.valid);
          }
        }),
        debounceTime(300),
        switchMap((price: number) => {
          this.priceChange.emit(price.toString());
          if (this.price.valid) {
            return this.campaignCalculationsService.campaignCalculations(this.uniqueCode(), price * 10);
          } else {
            return of(this.campaignCalculationsService.resetCampaignItem());
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.wageAmount = response.wageAmount;
            this.campaignWageAmount = response.campaignWageAmount;
            this.campaignDiscount = response.campaignDiscount;
          }
          if (this.price.valid) {
            this.isLoadingGetPricing.set(false);
            this.isPriceValid.emit(true);
          }
        },
        error: (err) => {
          this.messageService.showErrorIfExists(err);
          this.isLoadingGetPricing.set(false);
          this.isPriceValid.emit(false);
          subscription.unsubscribe();
          this.subscribeOnPriceChanges();
        }
      });
    super.addSubscription(subscription);
  }

  handleClick(): void {
    this.activeChanged.emit(
      UsedSelectedCardTypeModel.Manual
    );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
