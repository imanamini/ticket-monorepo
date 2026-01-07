import { Pipe, PipeTransform } from '@angular/core';
import { PasswordType } from 'src/app/user-interface/code-protection-applet/password-type';

@Pipe({
  name: 'passwordType'
})
export class PasswordTypePipe implements PipeTransform {

  transform(value: PasswordType): any {
    let result: string;
    switch (value) {
      case 'PIN':
        result = 'کیف‌پول';
        break;
      case 'OTP':
        result = 'ارسال شده';
        break;
    }
    return result;
  }

}
