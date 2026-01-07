import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UiSpinnerComponent } from '../../ui-loading/ui-spinner/ui-spinner.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgIf } from '@angular/common';
import { UiTextFieldComponent } from '../../ui-form/text-field/ui-text-field.component';

@Component({
  selector: 'app-ui-c2c-card-number-input',
  templateUrl: './card-number-input.component.html',
  styleUrls: ['./card-number-input.component.scss'],
  standalone: true,
  imports: [UiTextFieldComponent, NgIf, ApiImageModule, UiSpinnerComponent],
})
export class CardNumberInputComponent implements AfterViewInit {
  @Input()
  showSpinner = false;

  @Input()
  label = 'شماره کارت';

  @Input()
  bankLogoId: string = null;

  @Output()
  cardNumber = new EventEmitter();

  @Input()
  parentForm: FormGroup;

  @Input()
  name: string;

  @Input()
  value: string;

  @Input()
  errorState: boolean;

  @Input()
  validationRules: Array<any> = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getCardNumber(val): void {
    this.cardNumber.emit(val);
  }

  onClear(): void {}
}
