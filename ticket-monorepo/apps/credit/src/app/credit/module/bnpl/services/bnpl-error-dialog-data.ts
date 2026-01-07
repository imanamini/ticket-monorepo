import { BnplErrorConfig } from './bnpl-error-handling-config';

export interface ErrorDialogData {
  title?: string;
  description?: string;
  errorType: number;
  errorConfig: BnplErrorConfig;
  ctaText: string;
}
