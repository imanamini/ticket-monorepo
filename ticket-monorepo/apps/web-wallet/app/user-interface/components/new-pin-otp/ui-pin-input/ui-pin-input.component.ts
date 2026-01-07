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
import { convertNonEnglishDigits } from '../../../../utils/strings';

@Component({
  selector: 'ui-pin-input',
  templateUrl: './ui-pin-input.component.html',
  styleUrls: ['./ui-pin-input.component.scss']
})
export class UiPinInputComponent implements OnInit, OnChanges {

  @Input()
  description = '';

  @Input()
  value = '';

  valueArray = [];

  @Input()
  type: 'OTP' | 'PIN' = 'PIN';

  @Input()
  hasError = false;

  @Output()
  pinChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputs', {
    static: false,
  })
  inputs: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  pinInputs = new Array(4);

  otpInputs = new Array(6);
  inputTemplateInstance: HTMLInputElement;

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
      for (let i = 0; i < this.inputs.nativeElement.children.length; i++) {
        const el = this.inputs.nativeElement.children.item(i);
        const input = el.children.item(0) as HTMLInputElement;
        input.value = '';
        this.focusOnFirstInput();
      }
    }
  }

  valueChaneCallback(): void {
    this.valueArray.forEach((char, i) => {
      const el = this.inputs.nativeElement.children.item(i);
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
    const max = this.getMaxIndex();
    if (index < 0 || index > max) {
      return;
    }
    this.inputIndex = index;
    const el = this.inputs.nativeElement.children.item(this.inputIndex);
    const input = el.children.item(0) as HTMLInputElement;
    this.inputTemplateInstance = input
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement): void {
    element.focus();
  }

  inputFocusIn(i: number): void {
    this.inputIndex = i;
  }

  inputKeyUp($event): void {
    const i = this.inputIndex;
    const max = this.getMaxIndex();
    const prevVal = this.valueArray[i];
    const key = parseInt(convertNonEnglishDigits($event.key), 10);
    if (isNaN($event.target.value)){
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
    if ($event.key === 'Backspace') {
      const prevVal = this.valueArray[i];
      this.valueArray[i] = '';
      this.dynamicFocusInput(this.inputIndex - 1);
    }
  }

  public clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value = '';
  }

  public clearInputs(){
    for (let index = 0; index < this.pinInputs.length; index++) {
      this.dynamicFocusInput(index)
      this.inputTemplateInstance.value = ''
    }
  }

  private getInput(index: number): HTMLInputElement {
    const el = this.inputs.nativeElement.children.item(index);
    return el.children.item(0) as HTMLInputElement;
  }

  private getMaxIndex(): number {
    return this.type === 'PIN' ? this.pinInputs.length - 1 : this.otpInputs.length - 1;
  }
}
