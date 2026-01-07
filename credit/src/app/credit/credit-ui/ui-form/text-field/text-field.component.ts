import {
  AfterViewChecked,
  AfterViewInit,
  Component, ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, QueryList,
  ViewChild
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TextFieldNoticeMark } from '../directives/text-field-notice-mark.directive';
import { FieldMark } from '../directives/text-field-input-mark.directive';

@Component({
  selector: 'ui-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit, AfterViewInit, AfterViewChecked {

  /*
  |--------------------------------------------------------------------------
  | Inputs
  |--------------------------------------------------------------------------
  */
  @Input()
  label: string = '';

  @Input()
  clearable = false;

  @Input()
  maxLength: number = 0;

  @Input()
  form: UntypedFormGroup;

  @Input()
  name: string;

  @Input()
  disabled: boolean = false;

  /*
  |--------------------------------------------------------------------------
  | Local properties
  |--------------------------------------------------------------------------
  */

  focused = false;

  inputEl: HTMLInputElement;

  hasError = false;

  hasValue = false;

  /*
  |--------------------------------------------------------------------------
  | Outputs
  |--------------------------------------------------------------------------
  */
  @Output()
  focusedIn = new EventEmitter<any>();

  @Output()
  focusedOut = new EventEmitter<any>();

  @Output()
  clicked = new EventEmitter<any>();

  @Output()
  cleared = new EventEmitter<any>();

  /*
  |--------------------------------------------------------------------------
  | View children
  |--------------------------------------------------------------------------
  */
  @ViewChild('textField', {
    static: false,
  })
  textField: ElementRef<HTMLDivElement>;

  /**
   * Query for `input` itself
   */
  @ContentChildren(FieldMark)
  textFieldInput: QueryList<FieldMark>;

  /**
   * Query for notices (errors, hints, etc.)
   */
  @ContentChildren(TextFieldNoticeMark)
  notices: QueryList<TextFieldNoticeMark>;

  constructor() {
    this.focusIn = this.focusIn.bind(this);
    this.focusOut = this.focusOut.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.inputClicked = this.inputClicked.bind(this);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.textField && this.textField.nativeElement) {
      this.inputEl = this.textField.nativeElement.querySelector('input, textarea');
      this.inputEl.addEventListener('focusin', this.focusOut);
      this.inputEl.addEventListener('focusout', this.focusIn);
      this.inputEl.addEventListener('keydown', this.keyDown);
      this.inputEl.addEventListener('click', this.inputClicked);
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      if (this.inputEl) {
        if (this.inputEl.classList.contains('ng-invalid')
          && this.inputEl.classList.contains('ng-touched')) {
          this.hasError = true;
        } else {
          this.hasError = false;
        }
        this.hasValue = this.inputEl.value.length > 0;
      }
    }, 50);
  }

  focusIn($event) {
    this.toggleFocus();
    this.focusedOut.emit($event);
  }

  focusOut($event) {
    this.toggleFocus();
    this.focusedIn.emit($event);
  }

  keyDown($event) {
    if (this.disabled) {
      $event.preventDefault();
    }
    if (this.maxLength && this.maxLength > 0) {
      if ($event.target.value.length >= this.maxLength) {
        $event.preventDefault();
      }
    }
  }

  labelClicked() {
    if (this.inputEl) {
      this.inputEl.focus();
    }
  }

  toggleFocus() {
    this.focused = !this.focused;
  }

  inputClicked($event) {
    this.clicked.emit($event);
  }

  clear() {
    this.inputEl.value = '';
    this.inputEl.dispatchEvent(new Event('input'));
    this.cleared.emit();
  }

}
