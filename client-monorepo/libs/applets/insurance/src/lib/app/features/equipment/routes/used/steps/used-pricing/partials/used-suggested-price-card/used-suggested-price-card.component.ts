import {
  Component,
  effect,
  EventEmitter,
  HostListener,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UsedInfoBoxComponent } from '../../../../partials/used-info-box/used-info-box.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgClass } from '@angular/common';
import { UsedSelectedCardTypeModel } from '../../models/used-selected-card-type';
import { splitText } from '../../../../../../../../util/split-text';
import { InsurancePremiumCardComponent } from '../insurance-premium-card/insurance-premium-card.component';
import { CampaignCalculationsService } from '../../services/campaign-calculations.service';
import { CampaignCalculationsModel } from '../../models/campaign-calculations.model';

@Component({
  selector: 'used-suggested-price-card',
  templateUrl: './used-suggested-price-card.component.html',
  standalone: true,
  imports: [
    PipesModule,
    UsedInfoBoxComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgClass,
    InsurancePremiumCardComponent
  ],
  styleUrls: ['./used-suggested-price-card.component.scss']
})
export class UsedSuggestedPriceCardComponent implements OnInit, OnDestroy {
  constructor(private service: SharedUsedService,
              private campaignCalculationsService: CampaignCalculationsService) {
  }

  suggestedPrice = input<number>();
  uniqueCode = input<string>();
  modelInfoArray: string[] = [];
  mModel: string;
  mIsActive: boolean;
  campaignItem = signal<CampaignCalculationsModel>(null);

  @Input()
  set model(val: string) {
    if (val) {
      this.mModel = val;
      this.modelInfoArray = splitText(val);
    }
  }

  get model(): string {
    return this.mModel;
  }

  @Input()
  set isActive(val: boolean) {
    this.mIsActive = val;
  }

  get isActive(): boolean {
    return this.mIsActive;
  }

  @Output()
  selectedChange: EventEmitter<UsedSelectedCardTypeModel> =
    new EventEmitter<UsedSelectedCardTypeModel>();

  subscriptions = new Subscription();

  @HostListener('click', ['$event']) clickHandler(): void {
    this.handleClick();
  }

  ngOnInit(): void {
    this.subscribeOnBackClick();
    this.getCampaignCalculations();
  }

  private getCampaignCalculations(): void {
    if (this.suggestedPrice()) {
      this.campaignCalculationsService.campaignCalculations(this.uniqueCode(), this.suggestedPrice()).subscribe({
        next: (response) => {
          this.campaignItem.set(response);
        }
      });
    }
  }

  subscribeOnBackClick(): void {
    const subscription = this.service.getBackClick()
      .subscribe({
        next: () => {
          this.service.setStepChangeSubject('PREVIOUS');
        }
      });
    this.subscriptions.add(subscription);
  }

  handleClick(): void {
    this.selectedChange.emit(UsedSelectedCardTypeModel.NotManual);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
