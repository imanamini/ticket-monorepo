import { GenericApiResponse } from '../../generic-api-response.model';
import { BankAccountVerificationStatus } from './bank-account-verification-status';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

export interface GetBankAccountVerificationStatusResponse extends GenericApiResponse {
  status: BankAccountVerificationStatus;
  title: string;
  message: string;
  imageId: string;
  checkCountDown: number;
  retryable: boolean;
  buttonLabel: string;
  pageTitle: string;
  errorCodes: Array<number>;
  errorMessages: Array<string>;
  buttons: Buttons[];
}

export const errorCodesTranslations: Record<number, string[]> = {
  10005: ['شما در بانک ملت حساب فعال ندارید، یا به علت داشتن مشکل نظام وظیفه امکان دریافت وام ندارید.'],
  10118: ['شما دارای چک برگشتی یا اقساط معوق در سیستم بانکی کشور هستید.'],
  10122: ['کد شهاب شما صادر نشده است.'],
  10189: ['اطلاعات هویتی که وارد کردید اشتباه است.'],
  10128: ['کد شهاب شما صادر نشده است.'],
  10182: ['اطلاعات هویتی که وارد کردید اشتباه است.'],
  10302: ['سقف وام قابل دریافت برای شما از بانک ملت پر شده است.'],
  200001: ['سقف وام قابل دریافت برای شما از بانک ملت پر شده است.'],
};

export const translateErrorCode = (numbers: number[]): { code: number; text: string }[] => {
  return numbers.reduce((acc: { code: number; text: string }[], num) => {
    const translations = errorCodesTranslations[num];
    if (translations) {
      return acc.concat(translations.map((text) => ({ code: num, text })));
    }
    return acc;
  }, []);
};
