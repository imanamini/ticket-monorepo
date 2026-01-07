import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { FormsModule } from '@angular/forms';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { SecretInputDirective } from '../../../data-access/directives/secret-input.directive';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'ui-pin-input',
  templateUrl: './ui-pin-input.component.html',
  styleUrls: ['./ui-pin-input.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, SecretInputDirective, FormDirectivesModule, FormsModule]
})
export class UiPinInputComponent implements OnInit, OnChanges {

  @Input() description = '';

  @Input() value = '';

  @Input() type: 'OTP' | 'PIN' = 'PIN';

  @Input() hasError = false;
  @Input() readonly = false;

  @Output() pinChange: EventEmitter<string> = new EventEmitter();
  valueArray = [];

  @ViewChild('inputs', {
    static: false,
  })
  inputs: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  pinInputs = new Array(4);

  otpInputs = new Array(6);

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.focusOnFirstInput();
    }, 300);

    this.clearValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasError && changes.hasError.previousValue === true && changes.hasError.currentValue === false) {
      this.clearValue();
      for (let i = 0; i < this.inputs?.nativeElement?.children?.length; i++) {
        const el = this.inputs?.nativeElement?.children.item(i);
        const input = el?.children?.item(0) as HTMLInputElement;
        input.value = '';
        this.focusOnFirstInput();
      }
    }
    if (changes.value) {
      this.valueArray = this.value.split('');
      this.valueChangeCallback();
      this.dynamicFocusInput(this.value.length);
    }
  }

  valueChangeCallback(): void {
    this.valueArray.forEach((char, i) => {
      const el = this.inputs?.nativeElement?.children?.item(i);
      if (el) {
        const input = el?.children?.item(0) as HTMLInputElement;
        input.value = char;
      }
    });
    this.value = this.valueArray.join('');
    this.pinChange.emit(this.value);
  }

  onChange(index: number, value: string): void {
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

  focusOnFirstInput(): void {
    this.dynamicFocusInput(0);
  }

  dynamicFocusInput(index: number): void {
    if (index < 0 || index > 5) {
      return;
    }
    this.inputIndex = index;
    if (!this.inputs) {
      return;
    }
    const el = this.inputs?.nativeElement?.children?.item(this.inputIndex);
    const input = el?.children?.item(0) as HTMLInputElement;
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement): void {
    element.focus();
  }

  inputFocusIn(i: number): void {
    this.inputIndex = i;
  }

  inputKeyUp($event): void {
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

  otpInputKeyUp($event, i): void {
    if (this.readonly) {
      return;
    }
    if ($event.key === 'Backspace') {
      this.valueArray[i] = '';
      this.dynamicFocusInput(this.inputIndex - 1);
    }
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value = '';
  }

  private getInput(index: number): HTMLInputElement {
    const el = this.inputs?.nativeElement?.children?.item(index);
    return el.children.item(0) as HTMLInputElement;
  }

  private getMaxIndex(): number {
    return this.type === 'PIN' ? this.pinInputs.length - 1 : this.otpInputs.length - 1;
  }
}
