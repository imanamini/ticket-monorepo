import {
  AfterViewChecked,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FieldMark } from '../directives/text-field-input-mark.directive';
import { TextFieldNoticeMark } from '../directives/text-field-notice-mark.directive';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, AfterViewChecked {

  /*
   |--------------------------------------------------------------------------
   | Inputs
   |--------------------------------------------------------------------------
   */
  @Input()
  label: string = '';

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
  selectElement: HTMLSelectElement;

  hasError = false;

  hasValue = false;

  /*
  |--------------------------------------------------------------------------
  | Outputs
  |--------------------------------------------------------------------------
  */

  @Output()
  changed = new EventEmitter<any>();

  /*
  |--------------------------------------------------------------------------
  | View children
  |--------------------------------------------------------------------------
  */
  @ViewChild('textField', {
    static: false,
  })
  refToField: ElementRef<HTMLDivElement>;

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
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.refToField && this.refToField.nativeElement) {
      this.selectElement = this.refToField.nativeElement.querySelector('select');
      this.selectElement.addEventListener('change', this.selectChange.bind(this));
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      if (this.selectElement) {
        if (this.selectElement.classList.contains('ng-invalid')
          && this.selectElement.classList.contains('ng-touched')) {
          this.hasError = true;
        } else {
          this.hasError = false;
        }
        this.hasValue = this.selectElement.value.length > 0;
      }
    }, 50);
  }

  labelClicked(event) {
    if (this.selectElement) {
      setTimeout(() => {
        this.selectElement.dispatchEvent(event);
      });
    }
  }

  selectChange($event) {
    this.changed.emit($event.target.value);
  }
}
