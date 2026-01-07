import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'base-field-type',
  template: '',
})
export class BaseFieldType {
  @Input() form: UntypedFormGroup;
  @Input() formControlName = 'input';
  @Input() label: string;
  @Input() hint: string;
  @Input() placeholder: string;
  @Input() errorMessage: string | boolean;
  @Input() readonly: boolean;
  @Input() hasCleaner = false;
  @Input() ltrInput = false;
  @Input() ltrPlaceholder = false;

  clean($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    this.form.controls[this.formControlName].setValue(null);
  }
}
