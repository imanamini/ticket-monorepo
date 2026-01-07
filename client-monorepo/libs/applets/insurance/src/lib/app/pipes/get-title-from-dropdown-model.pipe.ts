import { Pipe, PipeTransform } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';

@Pipe({
  name: 'getTitle',
  standalone: true
})
export class GetTitleFromDropdownModelPipe implements PipeTransform {

  transform(value: unknown, options: FormFieldOption[]): string {
    return options?.find(option => option.value === value)?.title || '';
  }
}
