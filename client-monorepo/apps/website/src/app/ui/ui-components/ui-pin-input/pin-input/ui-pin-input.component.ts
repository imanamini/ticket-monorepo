import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { convertNonEnglishDigits } from '@digipay/strings';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-ui-pin-input',
  templateUrl: './ui-pin-input.component.html',
  styleUrls: ['./ui-pin-input.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, FormDirectivesModule],
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

  otpInputs = new Array(5);

  ngOnInit(): void {
    of('')
      .pipe(delay(300))
      .subscribe({
        next: () => {
          this.focusOnFirstInput();
        },
      });
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
    this.value = this.valueArray.join('');
    this.pinChange.emit(this.value);
  }

  focusOnFirstInput(): void {
    this.inputIndex = 0;
    const el = this.inputs.nativeElement.children.item(this.inputIndex);
    const input = el.children.item(0) as HTMLInputElement;
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

    switch ($event.key) {
      case 'Backspace':
        this.valueArray[i] = '';
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

    this.valueChaneCallback();

    const nextInput = this.getInput(this.inputIndex);
    if (this.inputIndex !== i) {
      this.focusOnInput(nextInput);
    }
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value = '';
  }

  private getInput(index: number): HTMLInputElement {
    const el = this.inputs.nativeElement.children.item(index);
    return el.children.item(0) as HTMLInputElement;
  }

  private getMaxIndex(): number {
    return this.type === 'PIN' ? this.pinInputs.length - 1 : this.otpInputs.length - 1;
  }
}
