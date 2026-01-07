import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'errorMessage'
})
export class ErrorMessagePipe implements PipeTransform {

  transform(status: number, error: any): any {
    let message = '';

    switch (status) {
      case 500:
        message = 'خطای سرور داخلی، سرور به دلیل نامعلومی نمی تواند درخواست را پردازش کند.';
        break;

      case 503:
        message = 'خطای سرویس در دسترس نیست، سرور بیش از حد بارگیری شده است یا در حال تعمیر است.';
        break;

      case 504:
        message = 'سرویس دردسترس نیست لطفا مجددا تلاش کنید.';
        break;

      case 401:
        message = 'خطای احراز هویت';
        break;

      case 400:
        message = 'درخواستی که به سرور ارسال شده است نامعتبر است.';
        break;

      case 403:
        message = 'خطا، به دلیل عدم دسترسی به منبع درخواستی.';
        break;

      case 404:
        message = 'منبع پیدا نشد.';
        break;

      case 405:
        message = 'متد درخواست برای منبع درخواستی پشتیبانی نمی شود';
        break;

      case 409:
        message = 'به دلیل تداخل در وضعیت فعلی منبع، درخواست پردازش نشد';
        break;

      case 429:
        message = 'درخواست های خیلی زیاد، شما در مدت زمان معینی درخواست های زیادی ارسال کرده اید. لطفاً بعداً دوباره امتحان کنید.';
        break;

      case 422:
        if (error.error && error.error.result.message) {
          message = error.error.result.message;
        } else {
          message = 'سرور قادر به پردازش دستورالعمل های موجود نیست. لطفا مجددا تلاش کنید.';
        }
        break;

      case 0:
        message = 'لطفا اتصال به اینترنت خود را بررسی کنید.';
        break;
    }
    return message;
  }

}
