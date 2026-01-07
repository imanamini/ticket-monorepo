import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { FormsModule } from '@angular/forms';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-pin-input',
  templateUrl: './pin-input.component.html',
  styleUrls: ['./pin-input.component.scss'],
  standalone: true,
  imports: [FormsModule, FormDirectivesModule, NgClass],
})
export class PinInputComponent implements OnInit {
  @Input() description = '';

  @Input() value = '';

  @Input() type: 'OTP' | 'PIN' = 'PIN';

  @Input() hasError = false;
  @Input() readonly = false;

  @Output() pinChange: EventEmitter<string> = new EventEmitter();
  @Output() onRemove: EventEmitter<string> = new EventEmitter();
  valueArray: any[] = [];

  @ViewChild('inputs', {
    static: false,
  })
  inputs!: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  pinInputs = new Array(4);

  otpInputs = new Array(5);

  ngOnInit(): void {
    setTimeout(() => {
      this.focusOnFirstInput();
    }, 300);

    this.clearValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasError'] && changes['hasError'].previousValue === true && changes['hasError'].currentValue === false) {
      this.clearValue();
      for (let i = 0; i < this.inputs.nativeElement.children.length; i++) {
        this.clearOtpField('', i);
        this.focusOnFirstInput();
      }
    }
    if (changes['value']) {
      this.valueArray = this.value?.split('');
      this.valueChangeCallback();
      this.dynamicFocusInput(this.value?.length);
    }
  }

  valueChangeCallback(): void {
    this.valueArray?.forEach((char, i) => {
      this.clearOtpField(char, i);
    });
    this.value = this.valueArray?.join('');
    this.pinChange.emit(this.value);
  }

  onChange(index: number, value: string): void {
    if (isNaN(+value)) {
      this.clearOtpField('', index);
    }
    value = convertNonEnglishDigits(value);
    value = value.replace(/\D/g, '');
    if (value.length === 0) {
      return;
    }
    if (value.length === 1) {
      this.valueArray[index] = value;
      this.valueChangeCallback();
      if (index < this.getMaxIndex()) {
        this.dynamicFocusInput(index + 1);
      }
    }
    if (value.length > 1) {
      const valueArr = value.split('');
      valueArr.forEach((char, i) => {
        if (index + i > this.getMaxIndex()) {
          return;
        }
        // set Value input (index + i)
        this.valueArray[index + i] = char;
        this.valueChangeCallback();
        // focus next input (max)
        if (index + i + 1 <= this.getMaxIndex()) {
          this.dynamicFocusInput(index + i + 1);
        }
      });
    }
  }

  clearOtpField(char: string, index: number) {
    const el = this.inputs.nativeElement.children.item(index);
    const input = el?.children.item(0) as HTMLInputElement;
    input.value = char;
  }

  focusOnFirstInput(): void {
    this.dynamicFocusInput(0);
  }

  dynamicFocusInput(index: number): void {
    if (index < 0 || index > 4) {
      return;
    }
    this.inputIndex = index;
    if (!this.inputs) {
      return;
    }
    const el = this.inputs.nativeElement.children.item(this.inputIndex);
    const input = el?.children.item(0) as HTMLInputElement;
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement): void {
    element.focus();
  }

  inputFocusIn(i: number): void {
    this.inputIndex = i;
  }

  inputKeyUp($event: any): void {
    if (this.readonly) {
      return;
    }
    const i = this.inputIndex;
    const max = this.getMaxIndex();
    const prevVal = this.valueArray[i];
    const key = parseInt(convertNonEnglishDigits($event.key), 10);
    if (isNaN($event.target.value)) {
      $event.target.value = $event.target.value.replace(/\w|-/g, '');
    }
    switch ($event.key) {
      case 'Backspace':
        this.valueArray[i] = '';
        if (prevVal) {
          this.dynamicFocusInput(this.inputIndex - 1);
        }
        if (prevVal === '' && this.inputIndex >= 1) {
          this.inputIndex--;
        }
        break;
      default:
        if (!isNaN(key)) {
          this.valueArray[i] = key;
          if (this.inputIndex < max) {
            this.inputIndex++;
          }
        }
        break;
    }
    this.value = this.valueArray.join('');
    this.pinChange.emit(this.value);

    const nextInput = this.getInput(this.inputIndex);
    if (this.inputIndex !== i) {
      this.focusOnInput(nextInput);
    }
  }

  otpInputKeyUp($event: any, i: any): void {
    if (this.readonly) {
      return;
    }
    if ($event.key === 'Backspace') {
      this.valueArray[i] = '';
      this.dynamicFocusInput(this.inputIndex - 1);
      this.onRemove.emit(this.valueArray.reduce((acc, item) => (item ? acc + item : acc), ''));
    }
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value = '';
  }

  private getInput(index: number): HTMLInputElement {
    const el = this.inputs.nativeElement.children.item(index);
    return el?.children.item(0) as HTMLInputElement;
  }

  private getMaxIndex(): number {
    return this.type === 'PIN' ? this.pinInputs.length - 1 : this.otpInputs.length - 1;
  }
}
