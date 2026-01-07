import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BanksModel } from '../../../../api/digipay/models/cash-out/banks.model';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-card-number-input',
  templateUrl: './ui-card-number-input.component.html',
  styleUrls: ['./ui-card-number-input.component.scss'],
  standalone: true,
  imports: [NgIf, ApiImageModule],
})
export class UiCardNumberInputComponent implements AfterViewInit {
  @Output() cardNumber = new EventEmitter();
  @Output() gotError = new EventEmitter<boolean>();
  @Input() placeHolder: string;
  @Input() cardNumberValue;
  @Input() autoFocus = false;
  @Input() title: string;
  @Input() hint: string;
  @Input() banks: Array<BanksModel>;
  @ViewChild('input', { static: false }) input: ElementRef<HTMLInputElement>;
  inputFocused = false;
  imageId = '';
  grayLabel = true;
  separated = [];

  constructor(private cdref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.cardNumberValue) {
      this.input.nativeElement.value = this.cardNumberValue;
      this.imageId = this.getSelectedBank(this.cardNumberValue.toString())[0]?.imageId;
      this.cardNumber.emit(this.cardNumberValue.replace(/-/gi, ''));
    }
    if (this.autoFocus) {
      this.input.nativeElement.select();
      this.inputFocused = true;
    }
    this.gotError.emit(!this.cardNumberValue);
    this.cdref.detectChanges();
  }

  onValueChanged(val): any {
    this.hint = '';
    const regexp = new RegExp(/\d/g);
    const inputValue = val.target.value;
    /*here we stop type anything except numbers */
    if (
      this.input.nativeElement.value.length === 20 ||
      (!regexp.test(inputValue?.slice(-1)) && val.inputType !== 'deleteContentBackward')
    ) {
      this.input.nativeElement.value = this.input.nativeElement.value?.substring(0, this.input.nativeElement.value?.length - 1);
    }
    const separated = inputValue.split('-');
    /*put -dash- per four characters */
    if (
      val.inputType !== 'deleteContentBackward' &&
      separated.pop()?.length === 4 &&
      separated.length < 4 &&
      this.input.nativeElement.value.length !== 19
    ) {
      this.input.nativeElement.value = this.input.nativeElement.value + '-';
    } else if (val.inputType === 'deleteContentBackward' && separated.pop()?.length === 4) {
      this.input.nativeElement.value = this.input.nativeElement.value.substring(0, this.input.nativeElement.value?.length - 1);
    }
    /*finding a chosen bank*/
    const selectedBank = this.getSelectedBank(inputValue);

    this.imageId = selectedBank[0]?.imageId;
    this.cardNumber.emit(this.input.nativeElement.value.replace(/-/gi, ''));
    !this.imageId ? this.gotError.emit(true) : this.gotError.emit(false);
  }

  getSelectedBank(value: string): any {
    return this.banks.filter((bank) => {
      if (value.split('-').join('').length > 5) {
        return bank.cardPrefixes.includes(value.split('-').join('').substring(0, 6));
      } else if (value.split('-').join('').length === 5) {
        return bank.cardPrefixes.includes(value.split('-').join(''));
      }
    });
  }

  clear(): void {
    this.input.nativeElement.value = '';
    this.input.nativeElement.focus();
    this.gotError.emit(true);
  }

  onFocus(focused): void {
    if (!focused && this.input.nativeElement.value.valueOf()) {
      this.inputFocused = true;
      this.grayLabel = true;
      return;
    }
    this.grayLabel = !focused;
    this.inputFocused = focused;
  }
}
