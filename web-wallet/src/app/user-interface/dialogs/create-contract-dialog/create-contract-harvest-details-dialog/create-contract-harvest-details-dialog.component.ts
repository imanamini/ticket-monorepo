import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { DirectDebitBank } from '../../../../api/models/direct-debit.response';
import { HARVEST_DETAIL_SHARE_DATA } from '../harvest-details-share-data-token';
import { BehaviorSubject } from 'rxjs';
import { GA_DIRECT_DEBIT_ID } from '../../../../api/constants/ga-direct-debit-id';
import { HarvestDetailsShareData } from '../harvest-details-share-data.model';
import { DurationTimeUnitEnum } from '../../../../api/emuns/duration-time-unit.enum';

@Component({
  selector: 'app-create-contract-harvest-details-dialog',
  templateUrl: './create-contract-harvest-details-dialog.component.html',
  styleUrls: ['./create-contract-harvest-details-dialog.component.scss']
})
export class CreateContractHarvestDetailsDialogComponent implements OnInit, AfterViewInit {
  GA_DIRECT_DEBIT_ID_CONTRACT = GA_DIRECT_DEBIT_ID.CONTRACT;
  contractPeriodItems = [
    {id: 3, title: '۳ ماه'},
    {id: 6, title: '۶ ماه'},
    {id: 9, title: '۹ ماه'},
    {id: 12, title: '۱۲ ماه'}
  ];

  @Input()
  selectedBank: DirectDebitBank;
  minWalletBalance = 500000;
  maxWalletBalance = 30000000;
  defaultDailyAmountMax = 2000000;

  constructor(
    @Inject(HARVEST_DETAIL_SHARE_DATA) public harvestDetailsData: BehaviorSubject<HarvestDetailsShareData>,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.setDefaultDailyAmountMax();
    this.setHarvestDetailsData();
  }

  ngAfterViewInit(): void {
    this.checkFormValidation();
  }

  private setHarvestDetailsData(): void {
    this.harvestDetailsData.next({
      isValidHarvestDetailsForm: false,
      minWalletBalance: this.minWalletBalance,
      maxDailyTransactionAmount: this.selectedBank.directDebit.dailyAmountMax,
      duration: {
        count: 3,
        timeUnit: DurationTimeUnitEnum.MONTH
      }
    });
  }

  private setDefaultDailyAmountMax(): void {
    if (this.selectedBank.directDebit && this.selectedBank.directDebit.dailyAmountMax) {
      return;
    }
    this.selectedBank.directDebit = {dailyAmountMax: this.defaultDailyAmountMax};
  }

  private checkFormValidation(): void {
    if (!(this.harvestDetailsData.value.minWalletBalance || this.harvestDetailsData.value.maxDailyTransactionAmount)) {
      this.harvestDetailsData.value.isValidHarvestDetailsForm = false;
      return;
    }
    if (this.minWalletBalance > this.harvestDetailsData.value.minWalletBalance) {
      this.harvestDetailsData.value.isValidHarvestDetailsForm = false;
      return;
    }
    if (this.harvestDetailsData.value.minWalletBalance > this.maxWalletBalance) {
      this.harvestDetailsData.value.isValidHarvestDetailsForm = false;
      return;
    }
    if (this.minWalletBalance > this.harvestDetailsData.value.maxDailyTransactionAmount) {
      this.harvestDetailsData.value.isValidHarvestDetailsForm = false;
      return;
    }
    if (this.harvestDetailsData.value.maxDailyTransactionAmount > this.selectedBank.directDebit.dailyAmountMax) {
      this.harvestDetailsData.value.isValidHarvestDetailsForm = false;
      return;
    }
    this.harvestDetailsData.value.isValidHarvestDetailsForm = true;
  }

  selectContractPeriod(selectedItemId): void {
    this.harvestDetailsData.value.duration.count = selectedItemId;
  }

  updateMinTransactionAmount(event): void {
    this.harvestDetailsData.next({...this.harvestDetailsData.value, minWalletBalance: event.numericValue});
    this.checkFormValidation();
    this.changeDetectorRef.detectChanges();
  }

  updateMaxTransactionAmount(event): void {
    this.harvestDetailsData.next({...this.harvestDetailsData.value, maxDailyTransactionAmount: event.numericValue});
    this.checkFormValidation();
    this.changeDetectorRef.detectChanges();
  }
}
