export interface ContactForm {
  formId: string;
  id: string;
  rows: Array<ContactFormField[]>;
  successMessage: string;
  successModalTitle: string;
  successModalDescription: string;
}

export interface ContactFormField {
  childPosition: number;
  id: string;
  label: string;
  mandatory: boolean;
  options: Array<{
    title: string;
    label: string;
    value: any;
  }>;
  pattern: string;
  rowNumber: number;
  type: 'TEXT' | 'MULTILINE_TEXT' | 'CHECKBOX' | 'DROPDOWN' | 'DATE' | 'TAB' | 'NATIONAL_ID' | 'CELL_NUMBER';
  datePickerOptions: {
    allowFuture: boolean;
    allowPast: boolean;
  };
  hint: string;
}
