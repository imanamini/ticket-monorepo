import {
  Component,
  ElementRef,
  HostListener, input,
  model,
  OnInit, output,
  ViewChild
} from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'es-loan-otp-input',
  standalone: true,
  imports: [
    NgClass,
    FormsModule
  ],
  templateUrl: './es-loan-otp-input.component.html',
  styleUrls: ['./es-loan-otp-input.component.scss']
})
export class EsLoanOtpInputComponent implements OnInit {
  value = model<string>('');
  errorMessage = input<string>('');
  inputIndex = model<number>(0);
  hasError = input<boolean>(false);
  otpChange = output<string>();

  valueArray: string[] = [];
  otpInputs = new Array(5);

  @ViewChild('inputs', {
    static: false,
  })
  inputs?: ElementRef<HTMLDivElement>;

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

    if (allowedKeys.indexOf(event.key) !== -1) {
      return; // Allow navigation and control keys
    }

    const isNumber = event.key >= '0' && event.key <= '9';
    if (!isNumber) {
      event.preventDefault(); // Prevent any other keys
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.focusOnFirstInput();
    }, 300);
    this.clearValue();
  }

  valueChaneCallback(): void {
    this.valueArray.forEach((char, i) => {
      if (!this.inputs) {
        return;
      }
      const el = this.inputs.nativeElement.children.item(i);
      if (!el) {
        return;
      }
      const input = el.children.item(0) as HTMLInputElement;
      input.value = char;
    });
    this.value.set(this.valueArray.join(''));
    this.otpChange.emit(this.value());
  }

  onChange(index: number, value: string) {
    value = convertNonEnglishDigits(value);
    value = value.replace(/\D/g, '');
    if (value.length === 0) {
      return;
    }
    if (value.length === 1) {
      this.valueArray[index] = value;
      this.valueChaneCallback();
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
        this.valueChaneCallback();
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

  dynamicFocusInput(index: number) {
    if (index < 0 || index > 5) {
      return;
    }
    this.inputIndex.set(index);
    if (!this.inputs) {
      return;
    }
    const el = this.inputs.nativeElement.children.item(this.inputIndex());
    if (!el) {
      return;
    }
    const input = el.children.item(0) as HTMLInputElement;
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement): void {
    element.focus();
  }

  inputFocusIn(i: number): void {
    this.inputIndex.set(i);
  }

  inputKeyUp($event: KeyboardEvent): void {
    const i = this.inputIndex();
    const max = this.getMaxIndex();
    const prevVal = this.valueArray[i];
    const key = parseInt(convertNonEnglishDigits($event.key), 10);
    switch ($event.key) {
      case 'Backspace':
        this.valueArray[i] = '';
        if (prevVal) {
          this.dynamicFocusInput(this.inputIndex() - 1);
        }
        if (prevVal === '' && this.inputIndex() >= 1) {
          this.inputIndex.update(value => value - 1);
        }
        break;
      default:
        if (!isNaN(key)) {
          this.valueArray[i] = '' + key;
          if (this.inputIndex() < max) {
            this.dynamicFocusInput(this.inputIndex() + 1);

          }
        }
        break;
    }
    this.value.set(this.valueArray.join(''));
    this.otpChange.emit(this.value());

    const nextInput = this.getInput(this.inputIndex());
    if (this.inputIndex() !== i && nextInput) {
      this.focusOnInput(nextInput);
    }
  }

  otpInputKeyUp($event: KeyboardEvent, i: number): void {
    if ($event.key === 'Backspace') {
      this.valueArray[i] = '';
      this.dynamicFocusInput(this.inputIndex() - 1);
    }
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value.set('');
  }

  private getInput(index: number): HTMLInputElement | null {
    if (!this.inputs) {
      return null;
    }
    const el = this.inputs.nativeElement.children.item(index);
    return el ? el.children.item(0) as HTMLInputElement : null;
  }

  private getMaxIndex(): number {
    return this.otpInputs.length - 1;
  }
}
