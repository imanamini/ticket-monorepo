import {
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { convertNonEnglishDigits } from '../../../../utils/strings';

@Component({
  selector: 'ui-pin-input',
  templateUrl: './ui-pin-input.component.html',
  styleUrls: ['./ui-pin-input.component.scss']
})
export class UiPinInputComponent implements OnInit {

  @Input()
  description = '';

  @Input()
  value = '';

  valueArray: string[] = [];

  @Input()
  type: 'OTP' | 'PIN' = 'PIN';

  @Input()
  hasError = false;

  @Input()
  errorMessage = '';

  @Output()
  pinChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputs', {
    static: false,
  })
  inputs?: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  pinInputs = new Array(4);

  otpInputs = new Array(6);

  constructor() {
  }

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
    this.value = this.valueArray.join('');
    this.pinChange.emit(this.value);
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
    this.inputIndex = index;
    if (!this.inputs) {
      return;
    }
    const el = this.inputs.nativeElement.children.item(this.inputIndex);
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
    this.inputIndex = i;
  }

  inputKeyUp($event: KeyboardEvent): void {
    const i = this.inputIndex;
    const max = this.getMaxIndex();
    const prevVal = this.valueArray[i];
    const key = parseInt(convertNonEnglishDigits($event.key), 10);
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
          this.valueArray[i] = '' + key;
          if (this.inputIndex < max) {
            this.inputIndex++;
          }
        }
        break;
    }
    this.value = this.valueArray.join('');
    this.pinChange.emit(this.value);

    const nextInput = this.getInput(this.inputIndex);
    if (this.inputIndex !== i && nextInput) {
      this.focusOnInput(nextInput);
    }
  }

  otpInputKeyUp($event: KeyboardEvent, i: number): void {
    if ($event.key === 'Backspace') {
      this.valueArray[i] = '';
      this.dynamicFocusInput(this.inputIndex - 1);
    }
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value = '';
  }

  private getInput(index: number): HTMLInputElement | null {
    if (!this.inputs) {
      return null;
    }
    const el = this.inputs.nativeElement.children.item(index);
    return el ? el.children.item(0) as HTMLInputElement : null;
  }

  private getMaxIndex(): number {
    return this.type === 'PIN' ? this.pinInputs.length - 1 : this.otpInputs.length - 1;
  }
}
