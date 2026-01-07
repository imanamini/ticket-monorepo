import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ui-expire-date',
  templateUrl: './ui-expire-date.component.html',
  styleUrls: ['./ui-expire-date.component.scss'],
})
export class UiExpireDateComponent implements AfterViewInit {
  @Input() value: string;
  @Output() valueChange = new EventEmitter();
  @Input() placeHolder: string;
  @ViewChild('input', { static: false }) input: ElementRef<HTMLInputElement>;
  inputFocused = false;
  grayLabel = true;
  hint: string;
  separated = [];
  sepLength = 0;

  constructor(private cdref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.input.nativeElement.value = this.value ? this.value : '';
    this.inputFocused = !!this.value;
    this.valueChange.emit({ gotError: !this.value, expireDate: this.value });
    this.cdref.detectChanges();
  }

  change(val): void {
    this.separated = this.input.nativeElement.value.split('/');
    const numberRegex = new RegExp(/\d/g);
    const inputValue = val.target.value;

    // when user deleting one number & there is after slash no numbers & before slash we have two or four numbers
    // here, we delete one char before slash
    if (
      val.inputType === 'deleteContentBackward' &&
      this.sepLength === 2 &&
      !this.separated[1]?.length &&
      this.separated[1]?.length !== 0
    ) {
      this.input.nativeElement.value = this.input.nativeElement.value.substring(0, this.input.nativeElement.value?.length - 1);
      this.sepLength--;
    }
    // when user entering chars, we stop him || user enters 2 number after slash sign;
    if (
      (!numberRegex.test(inputValue?.slice(-1)) && val.inputType !== 'deleteContentBackward') ||
      (this.separated.length === 2 && this.separated.pop().length === 3)
    ) {
      this.input.nativeElement.value = this.input.nativeElement.value?.substring(0, this.input.nativeElement.value?.length - 1);
      return;
    }
    const regexp = new RegExp(/^\d{4}\/\d{2}$|^\d{2}\/\d{2}$/g);
    const regexAddSlash = new RegExp(/^14[0-9]{2}$|^13[0-9]{2}$|^0[0-9]{1}$|^10$|^9[0-9]{1}$/g);
    if (!regexp.test(inputValue)) {
      this.hint = 'برای مثال 1404/04 ';
      this.valueChange.emit({
        gotError: true,
        expireDate: this.input.nativeElement.value,
      });
      if (regexAddSlash.test(inputValue) && val.inputType !== 'deleteContentBackward') {
        this.input.nativeElement.value = inputValue + '/';
        this.sepLength = this.input.nativeElement.value.split('/').length;
      }
    } else {
      this.hint = '';
      let exDate;
      if (inputValue.split('/')[0].length === 2) {
        exDate =
          inputValue.split('/')[0] > 90 && inputValue.split('/')[0] <= 99
            ? '13' + this.input.nativeElement.value
            : '14' + this.input.nativeElement.value;
      } else {
        exDate = this.input.nativeElement.value;
      }
      this.valueChange.emit({
        gotError: false,
        expireDate: exDate,
      });
    }
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
