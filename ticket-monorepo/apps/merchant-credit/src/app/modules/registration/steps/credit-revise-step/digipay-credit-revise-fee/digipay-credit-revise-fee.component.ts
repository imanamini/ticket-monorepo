import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MERCHANT_TYPE } from '../../../../../api/clients/registration/basic-models/merchant.type';
import { FeeItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { RegistrationService } from '../../../services/registration.service';

@Component({
  selector: 'app-digipay-credit-revise-fee',
  templateUrl: './digipay-credit-revise-fee.component.html',
  styleUrls: ['./digipay-credit-revise-fee.component.scss']
})
export class DigipayCreditReviseFeeComponent implements OnInit, OnChanges {
  @Input()
  registrationMaxAmount: number = 0;

  @Input()
  type: MERCHANT_TYPE = 0;

  @Output()
  changeMaxAmount = new EventEmitter<number>();

  selectableFees: FeeItem[] = [];
  selectedFees: { [key: string]: boolean } = {};
  maxAmount = 0;

  @Output()
  valueChanged: EventEmitter<{ value: string, isValid: boolean }> = new EventEmitter();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private registrationService: RegistrationService) {
  }

  ngOnInit(): void {
    this.initProcess();
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      iban: new FormControl('', [
        Validators.required,
        Validators.pattern(/IR\d{24}/)
      ]),
    });

    this.form.valueChanges.subscribe(value => {
      const isFormValid = this.form.valid;
      this.valueChanged.emit({value: value, isValid: isFormValid});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || changes.registrationMaxAmount) {
      this.initProcess();
    }
  }

  initProcess(): void {
    this.selectableFees = this.registrationService.amountToFees(this.type, this.registrationMaxAmount);
    let isSelected = false;
    this.selectableFees.forEach(item => {
      if (item.checked) {
        isSelected = true;
      }
    });
    if (!isSelected && this.selectableFees.length > 0) {
      this.selectableFees[0].checked = true;
    }
    this.selectedFees = {1: true};
    this.calculateMaxAmount();
  }

  calculateMaxAmount(): void {
    const selectedFeeIds = Object.keys(this.selectedFees).filter(feeId => this.selectedFees[feeId]);
    let maxAmount = this.registrationService.FeesToAmount(this.type, selectedFeeIds);
    this.maxAmount = maxAmount > this.registrationMaxAmount ? this.registrationMaxAmount : maxAmount;
    this.changeMaxAmount.emit(this.maxAmount);
  }

  onChange(id: string) {
    for (const item of this.selectableFees) {
      if (item.id === id) {
        item.checked = true;
        this.selectedFees = {[item.id]: true};
      } else {
        item.checked = false;
      }
    }
  }
}
