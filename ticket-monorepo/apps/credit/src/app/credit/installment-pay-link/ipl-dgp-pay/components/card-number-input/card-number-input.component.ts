import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'ui-c2c-card-number-input',
  templateUrl: './card-number-input.component.html',
  styleUrls: ['./card-number-input.component.scss']
})
export class CardNumberInputComponent implements OnInit, AfterViewInit {

  @Input()
  showSpinner = false;

  @Input()
  label = 'شماره کارت';

  @Input()
  bankLogoId: string = null;

  @Output()
  cardNumber = new EventEmitter();

  @Input()
  parentForm: UntypedFormGroup;

  @Input()
  name: string;

  @Input()
  value: string;

  @Input()
  errorState: boolean;

  @Input()
  validationRules: Array<any> = [];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getCardNumber(val) {
    this.cardNumber.emit(val);
  }

  onClear(): void {
  }
}
