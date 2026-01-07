import { AlphabetList } from '../../../../data-access/utils/strings';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';

export const AlphabetOptions: FormFieldOption[] = AlphabetList.map((item) => ({
  title: item,
  value: item,
}));
AlphabetOptions.unshift({
  title: '_',
  value: '_',
});
