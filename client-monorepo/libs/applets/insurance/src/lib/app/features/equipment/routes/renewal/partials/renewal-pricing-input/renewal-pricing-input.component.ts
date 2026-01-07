import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PricingApiService } from '../../../../api/services/pricing/pricing-api.service';
import { numberToString } from '../../../../../../util/number-to-string';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { UiInfoChipsComponent } from '../../../../../../components/ui-info-chips/ui-info-chips/ui-info-chips.component';
import { GetPriceModel } from '../../../../api/models/renewal/get-price.model';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { PricingListModel } from '../../../../api/models/pricing/pricing.model';
import { PricingListBodyModel } from '../../../../api/models/pricing/pricing-list-body.model';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-pricing-input',
  templateUrl: './renewal-pricing-input.component.html',
  standalone: true,
  styleUrls: ['./renewal-pricing-input.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [NgClass, ReactiveFormsModule, NgIf, NgForOf, UiInfoChipsComponent],
})
export class RenewalPricingInputComponent implements OnInit, OnDestroy {
  constructor(
    private pricingApiService: PricingApiService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
  ) {}

  // Subscriptions
  subscriptions: Subscription[] = [];
  mPreSelected: GetPriceModel;

  // View Child
  @ViewChild('dgPricingInput', { static: true }) dgPricingInput!: ElementRef;

  // Inputs
  @Input()
  hint: string;

  @Input()
  saleChannel: JourneyNamesModel;

  @Input()
  placeholder: string;

  @Input()
  readonly: boolean;

  @Input() set preSelected(value: GetPriceModel) {
    this.mPreSelected = value;
    this.preSelectEvent.emit();
  }

  get preSelected(): GetPriceModel {
    return this.mPreSelected;
  }

  @Output()
  priceSelected = new EventEmitter<PriceSelectionModel>();

  preSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  form = this.formBuilder.group({
    price: ['', []],
    range: ['', []],
  });
  controls = this.form.controls;

  // Vars
  isRangeSelected: boolean;
  selectedRange: PricingListModel;
  rangeSelectionEmitter = new EventEmitter<boolean>();
  id = '';
  pricingList: PricingListModel[];
  currency = 'تومان';
  value: string;
  numberInString: string;
  isMobile = isMobileOrTablet() || !isDesktop();

  ngOnInit(): void {
    this.subscribeToValueChanges();
    this.getPricing();
    this.subscribeToPreSelect();
  }

  subscribeToValueChanges(): void {
    this.subscriptions[0] = this.controls.price.valueChanges.subscribe(() => {
      this.resizeInput(this.dgPricingInput.nativeElement);
      this.generateNumberInString(this.isRangeSelected);
    });
    this.subscriptions[1] = this.rangeSelectionEmitter.subscribe({
      next: (isRangeSelected) => {
        this.isRangeSelected = isRangeSelected;
        this.handleValidators(this.isRangeSelected);
        this.changeCurrency(this.isRangeSelected);
        this.generateNumberInString(this.isRangeSelected);
      },
    });
    this.subscriptions[4] = this.form.valueChanges.subscribe(() => {
      this.priceSelected.emit({
        price: this.controls.price.value ? this.controls.price.value : null,
        pricingId: this.controls.range.value ? this.controls.range.value : null,
        validity: this.form.valid,
      });
    });
  }

  subscribeToPreSelect(): void {
    this.subscriptions[3] = this.preSelectEvent.subscribe({
      next: () => {
        this.preSelect(this.pricingList);
      },
    });
  }

  getPricing(): void {
    const body: PricingListBodyModel = {
      saleChannel: JourneyNamesModel[this.saleChannel],
      category: ProductCategoryModel[2],
    };
    this.subscriptions[2] = this.pricingApiService.getPricingList(body).subscribe({
      next: (res) => {
        this.pricingList = this.handleData(res.data.pricingList);
        this.preSelectEvent.emit();
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
  }

  handleData(data: PricingListModel[]): PricingListModel[] {
    for (const item of data) {
      item.minValue /= 10 * 1000000;
      item.maxValue /= 10 * 1000000;
    }
    return data.sort((a, b) => a.minValue - b.minValue);
  }

  preSelect(list: PricingListModel[]): void {
    if (list && this.preSelected) {
      list.forEach((item) => {
        if (this.preSelected.pricingId === item.pricingId) {
          this.handleRangeSelect(item);
          return;
        }
      });
    }
  }

  handleRangeSelect(range: PricingListModel): void {
    this.rangeSelectionEmitter.emit(true);
    this.selectedRange = range;
    this.controls.range.patchValue(this.selectedRange.pricingId);
    let value = '';
    if (range.isFirstRange) {
      value = 'کمتر از ' + range.maxValue;
    } else if (range.isLastRange) {
      value = 'بیشتر از ' + range.minValue;
    } else if (!range.isFirstRange && !range.isLastRange) {
      value = range.minValue + ' تا ' + range.maxValue;
    }
    this.controls.price.patchValue(value);
  }

  handleInputClick(): void {
    if (this.isRangeSelected) {
      this.rangeSelectionEmitter.emit(false);
      this.selectedRange = null;
      this.controls.range.patchValue(null);
      this.controls.price.reset();
      this.dgPricingInput.nativeElement.placeholder = '0';
      this.resizeInput(this.dgPricingInput.nativeElement);
    }
  }

  handleValidators(isRangeSelected: boolean): void {
    this.controls.price.setValidators(isRangeSelected ? [] : [Validators.required]);
    this.controls.range.setValidators(isRangeSelected ? [Validators.required] : []);
  }

  resizeInput(input: any): void {
    const widerChars = ['3', '4', '5', '7', '8'];
    const defaultCharacterWidth = 1;
    const widerCharacterWidth = 2;

    const totalWidth = Array.from(String(input.value)).reduce((width, char) => {
      if (widerChars.includes(char)) {
        return width + widerCharacterWidth;
      } else {
        return width + defaultCharacterWidth;
      }
    }, 0);

    input.style.width = (totalWidth ? totalWidth : 1) + 'ch';
  }

  changeCurrency(isRangeSelected: boolean): void {
    this.currency = isRangeSelected ? ' میلیون تومان' : ' تومان';
  }

  generateNumberInString(isRangeSelected: boolean): void {
    this.numberInString = isRangeSelected ? null : numberToString(this.controls.price.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}

export interface PriceSelectionModel {
  price: string | null;
  pricingId: string | null;
  validity: boolean;
}
