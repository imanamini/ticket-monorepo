import {
  Component, ElementRef, EventEmitter,
  Input, OnChanges, OnDestroy,
  OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';

@Component({
  selector: 'ui-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  multiline: {
    rows: number,
  } = null;

  @Input()
  name: string;

  @Input()
  label: string;

  @Input()
  validationRules: Array<any> = [];

  @Input()
  value: any;

  @Input()
  maxLength = 0;

  @Input()
  convertNonEnglishDigits = false;

  @Input()
  dataType: 'TEXT' | 'PASSWORD' | 'SECRET_NUMBER' | 'CARD_PAN' | 'NUMBER' | 'IBAN' = 'TEXT';

  @Input()
  disabled = false;

  @Input()
  tabIndex: string;

  @Input()
  clearable = false;

  @Input()
  parentForm: UntypedFormGroup;

  @Input()
  errorState = false;

  @Input()
  readonly = false;

  @Input()
  autofocus: boolean;

  @Input()
  inputId: string = null;

  /*
  |--------------------------------------------------------------------------
  | Outputs
  |--------------------------------------------------------------------------
  |
  */

  @Output()
  focusedOut = new EventEmitter();

  @Output()
  focusedIn = new EventEmitter();

  @Output()
  keyDown = new EventEmitter();

  @Output()
  keyUp = new EventEmitter();

  @Output()
  clicked = new EventEmitter();

  @Output()
  changed = new EventEmitter();

  @Output()
  cleared = new EventEmitter();

  /*
  |--------------------------------------------------------------------------
  | LOCAL
  |--------------------------------------------------------------------------
  */
  focused = false;

  form: UntypedFormGroup;

  @ViewChild('textField')
  textField: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

  valueChangeSubscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {
    this.form = this.formBuilder.group({
      field: [this.value, this.validationRules]
    });
    if (this.disabled) {
      this.form.controls.field.disable();
    }
  }

  ngOnInit() {
    this.valueChangeSubscription = this.form.valueChanges.subscribe(formValueChange => {
      const originalVal = formValueChange['field'];
      let newVal = originalVal;
      if (this.convertNonEnglishDigits) {
        newVal = convertNonEnglishDigits(newVal);
      }
      if (newVal !== originalVal) {
        this.form.patchValue({
          field: newVal
        }, {
          emitEvent: false,
        });
        this.updateParentForm();
      } else {
        this.updateParentForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.currentValue !== changes.value.previousValue) {
      this.form.controls.field.setValue(changes.value.currentValue);
    }
    if (changes.validationRules && changes.validationRules.currentValue && changes.validationRules.currentValue.length > 0) {
      this.form.controls.field.setValidators(this.validationRules);
    }
    if (changes.disabled) {
      if (changes.disabled.currentValue) {
        this.form.controls.field.disable();
      } else {
        this.form.controls.field.enable();
      }
    }
  }

  updateParentForm() {
    if (this.parentForm) {
      this.parentForm.controls[this.name].setValue(this.form.controls.field.value);
      this.parentForm.controls[this.name].markAsTouched();
    }
    this.changed.emit(this.form.controls.field.value);
  }

  focusIn($event) {
    this.toggleFocus();
    this.focusedIn.emit($event);
  }

  focusOut($event) {
    this.toggleFocus();
    this.focusedOut.emit($event);
  }

  onClick($event): void {
    this.clicked.emit($event);
  }

  labelClicked() {
    if (this.textField && this.textField.nativeElement) {
      this.textField.nativeElement.focus();
    }
  }

  toggleFocus() {
    this.focused = !this.focused;
  }

  clear() {
    this.form.controls.field.setValue('');
    this.form.controls.field.markAsUntouched();
    this.errorState = false;
    this.cleared.emit();
  }

  keyUpEvent($event) {
    this.keyUp.emit($event);
  }

  keyDownEvent($event) {

    if (this.dataType === 'SECRET_NUMBER') {
      // Since SECRET_NUMBER is a special type that replaces
      // the characters with a circle while typing, like HTML's password input,
      // updating the form value should be handled in here...
      const v = this.form.controls.field.value as string;
      if ($event.key !== 'Backspace' || $event.key !== 'Enter') {
        const key = parseInt(convertNonEnglishDigits($event.key), 10);
        if (!isNaN(key) && (v + key).length <= this.maxLength) {
          this.form.controls.field.setValue(v + key);
        }
      }
      if ($event.key === 'Backspace' && v.length > 0) {
        this.form.controls.field.setValue(v.slice(0, -1));
      }
    }

    this.keyDown.emit($event);
  }

  pasteHandler(evt: ClipboardEvent, type: string) {
    const clipboardData = evt.clipboardData || window['clipboardData'];
    const pastedText = clipboardData.getData('text');

    evt.preventDefault();

    switch (type) {
      case 'SECRET_NUMBER':
        this.pasteSecretNumber(pastedText);
        break;
      case 'CARD_PAN':
        this.pasteCardPan(pastedText);
        break;
    }
  }

  pasteCardPan(value: string) {
    const cardNumber = this.extractNumericalValue(value);

    let pastedText = cardNumber.replace(/(\d{4})/ig, '$1-');

    if (pastedText[pastedText.length - 1] === '-') {
      pastedText = pastedText.substr(0, pastedText.length - 1);
    }
    this.form.controls.field.setValue(pastedText);
  }

  pasteSecretNumber(value: string) {

    const num = new RegExp(/^[0-9]+$/);
    if (!num.test(value)) {
      return;
    }

    if (value.length > this.maxLength) {
      return;
    }
    const pastedText = convertNonEnglishDigits(value);
    this.form.controls.field.setValue(pastedText);
    const val = pastedText.replace(/[\d]/g, '⬤');
    this.textField.nativeElement.value = val;
  }

  extractNumericalValue(text) {
    text = text.match(/\d/g);
    text = text.join('');
    console.log(text);
    return text;
  }
}
