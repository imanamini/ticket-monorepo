import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'fb-field',
  templateUrl: './fb-field.component.html',
  styleUrls: ['./fb-field.component.scss']
})
export class FBFieldComponent implements OnInit, OnChanges {

  //  Current error message value
  errorMessage = '';

  //  Used for handling UI when has error
  showError = false;

  //  Default error messages that showing bottom of Input
  errorMessages = {
    'pattern': 'عبارت وارد شده نامعتبر است',
    'email': 'ورودی باید در قالب اینیل باشد',
    'max': 'عدد ورودی بیشتر از حد مجاز است',
    'min': 'عدد ورودی کمتر از حد مجاز است',
    'maxlength': 'عبارت وارد شده طولانی است',
    'minlength': 'عبارت وارد شده کوتاه است'
  };

  //  All errors that might occur in Angular validator
  errorItems = [
    'pattern',
    'email',
    'max',
    'min',
    'maxlength',
    'minlength'
  ];

  //  Customized ngModel input value
  @Input()
  value: string;

  //  Customized ngModel output event
  @Output()
  valueChange = new EventEmitter();

  //  Input id for handling click event for focus input
  @Input()
  inputId: string;

  //  Show float label when true
  @Input()
  hasFloatLabel = true;

  @Input()
  title: string;

  //  Angular Validator errors list
  @Input()
  errors: ValidationErrors;

  //  Hint message for show bottom of input
  @Input()
  hint = '';

  //  Show Clean Action if true
  //  Clean Input Action is an button left of
  //  input field for clear input value
  @Input()
  hasCleaner = false;

  //  Show Rial currency left of input
  @Input()
  showCurrency = false;

  // You can set custom error messages based on 'errorMessages' structure
  @Input()
  customErrorMessages = {};

  // Left to right input values for numbers & ltr languages
  @Input()
  ltrInput = false;

  // Left to right input placeholder for numbers & ltr languages
  @Input()
  ltrPlaceholder = false;

  ngOnInit() {
    // Set Custom errors if exists
    if (!!this.customErrorMessages) {
      this.errorMessages = {...this.errorMessages, ...this.customErrorMessages};
      this.errorItems.push(Object.keys(this.customErrorMessages)[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.findErrors();
    }
  }

  //  Find errors if occur in Input
  findErrors() {
    if (this.value && this.value.length) {
      if (this.errors) {
        this.showError = true;
        this.errorItems.forEach((error) => {
          if (this.errors[error]) {
            this.errorMessage = this.errorMessages[error];
            return;
          }
        });
      } else {
        this.errorMessage = '';
        this.showError = false;
      }
    } else {
      this.showError = false;
    }
  }

  //  Clean input value
  clearInputValue() {
    if (this.value) {
      this.valueChange.emit('');
    }
  }
}
