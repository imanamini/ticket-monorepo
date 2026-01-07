import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';

export const NumberOptions: FormFieldOption[] = [];
for (let i = 0; i < 100; i++) {
  NumberOptions.push({
    title: i.toString(),
    value: i.toString(),
  });
}

NumberOptions.unshift({
  title: '_',
  value: '_',
});
