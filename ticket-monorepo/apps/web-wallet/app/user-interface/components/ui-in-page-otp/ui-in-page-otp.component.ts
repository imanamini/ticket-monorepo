import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {closeIOsDeviceKeyboard} from '../../../utils/device';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ui-in-page-otp',
  templateUrl: './ui-in-page-otp.component.html',
  styleUrls: ['./ui-in-page-otp.component.scss']
})
export class UiInPageOtpComponent implements OnInit, OnChanges, AfterViewInit {

  canScrollToInputs = true;

  @Input()
  id: { input: string };

  @Input()
  length;

  @Input()
  cellNumber: string;

  otpForm: FormGroup;

  @Output()
  entered = new EventEmitter<string>();

  @Output()
  requestNewCode = new EventEmitter<any>();

  @Input()
  clearSignal = 0;

  @Input()
  disableInputs = false;

  @Input()
  inputType: 'text' | 'password' = 'text';

  @Input()
  hideAfterVerify = true;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    const fields = {};
    for (let i = 0; i < this.length; i++) {
      fields['otp' + i] = ['', Validators.required];
    }

    // use FormBuilder to create a form group
    this.otpForm = this.formBuilder.group(fields);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusOnInput(0);
    }, 150);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSignal'] && changes['clearSignal'].currentValue !== changes['clearSignal'].previousValue) {
      this.clearForm();
    }
  }

  clearForm() {
    const values = {};
    for (let i = 0; i < this.length; i++) {
      values['otp' + i] = '';
    }
    closeIOsDeviceKeyboard().then(() => {
      const elm = document.getElementById('otp' + (0));
      if (elm) {
        elm.focus();
        this.otpForm.markAsUntouched();
      }

      this.otpForm.setValue(values);
      this.otpForm.updateValueAndValidity();
    });
  }

  nextInput(currentIndex: number, event: any): void {
    const currentId = event.currentTarget.id;
    const isLastOne = currentIndex === this.length - 1;

    if (event.currentTarget.value.length > 0 && !isLastOne) {
      const element = document.getElementById('otp' + (currentIndex + 1));
      element.focus();
    }

    if (event.key == 'Backspace') {
      const id = currentId.charAt(currentId.length - 1);
      if (id >= 0) {
        closeIOsDeviceKeyboard().then(() => {
          const elm = document.getElementById('otp' + (id - 1));
          if (elm) {
            elm.focus();
          }
        });
      }
    }

    if (isLastOne && event.key !== 'Backspace' && this.otpForm.valid) {
      // submit
      this.onSubmit();
      this.canScrollToInputs = true;
    }
  }

  onSubmit() {
    let val = '';
    Object.keys(this.otpForm.value).forEach(k => {
      val += this.otpForm.value[k];
    });
    this.entered.emit(val);
  }

  receiveNewCode() {
    this.requestNewCode.emit();
  }

  focusOnInput(index) {
    const elm = document.getElementById('otp' + index);
    if (elm) {
      elm.focus();
      this.otpForm.markAsUntouched();
    }
  }

  get width() {
    // @ts-ignore
    // tslint:disable-next-line:radix
    return parseInt(100 / this.length) + '%';
  }
}
