import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { RESPONSE_ERROR_TYPE } from '../../credit-generate-digital-signature-step/general-digital-signature-steps.model';
import { WaitingStepperStateEnum } from '@digipay/ngx-waiting-stepper';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-media-error',
  templateUrl: './credit-generate-digital-signature-media-error.component.html',
  styleUrl: './credit-generate-digital-signature-media-error.component.scss',
  standalone: true,
  imports: [NgxStatusResultModule, NgxCalloutComponent, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureMediaErrorComponent {
  step = input<number>();
  totalSteps = input<number>();
  back = output();
  takeAgain = output();
  type = input<RESPONSE_ERROR_TYPE>();
  buttonText = computed(() => {
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_ERROR) {
      return 'ثبت دوباره عکس';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR) {
      return 'تلاش دوباره';
    }
    return 'ضبط دوباره ویدئو';
  });
  buttons = computed<Buttons[]>(() => [
    {
      id: 'digitalSignatureMediaFailedButton',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: this.buttonText(),
    },
  ]);
  title = computed(() => {
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_ERROR) {
      return 'عکس قابل قبول نیست';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR) {
      return 'عدم تطابق چهره با عکس کارت ملی';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_SIZE_ERROR) {
      return 'ویدئو کوتاه‌تری ضبط کنید';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_ERROR) {
      return 'ویدئو قابل قبول نیست';
    }
    return;
  });
  subtitle = computed(() => {
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_ERROR) {
      return 'لطفا با رعایت شرایط، ویدئو جدیدی ضبط کنید.';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_SIZE_ERROR) {
      return 'به محض خواندن جمله نمایش داده شده در مرحله ضبط ویدئو، دکمه توقف ضبط را بفشارید.';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_ERROR) {
      return 'لطفا با رعایت شرایط، عکس جدیدی ثبت کنید.';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR) {
      return 'لطفا اطلاعات وارد شده را بررسی و سپس عکس جدیدی ثبت کنید.';
    }
    return;
  });
  calloutTitle = computed(() => {
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_ERROR) {
      return 'ویدئو به یک یا چند دلیل زیر رد شده است:';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_ERROR) {
      return 'عکس به یک یا چند دلیل زیر رد شده است:';
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR) {
      return 'دلایل این مشکل می‌تواند موارد زیر باشد:';
    }
    return;
  });
  hints = computed(() => {
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_ERROR) {
      return [
        'تصویر تا جای ممکن بدون لرزش دست گرفته شود.',
        'نور مکان در دو طرف صورت مناسب و یکسان باشد.',
        'باید صورت در زاویه مستقیم دوربین قرار بگیرد.',
        'فقط فرد متقاضی در عکس حضور داشته باشد.',
        'عکس بدون ماسک ثبت شود.',
        'صورت وسط کادر مشخص شده قرار گرفته شود.',
      ];
    }
    if (this.type() === RESPONSE_ERROR_TYPE.PHOTO_COMPARE_ERROR) {
      return [
        'چهره شما در هنگام ثبت عکس، با زمان ثبت عکس کارت ملی دچار تفاوت شده است. (مثل عمل زیبایی، آرایش‌ و ...).',
        'به دلیل اشتباه وارد‌کردن شماره کارت ملی، نتوانستیم چهره شما و عکس را مطابقت دهیم.',
        'شماره سریال یا کد رهگیری کارت ملی در مرحله اول اشتباه وارد شده است.',
      ];
    }
    if (this.type() === RESPONSE_ERROR_TYPE.VIDEO_ERROR) {
      return [
        'جمله‌ی نمایش داده شده رسا و با دقت خوانده شود.',
        'ویدیو تا جای ممکن بدون لرزش دست گرفته شود.',
        'نور مکان در دو طرف صورت مناسب و یکسان باشد.',
        'فقط فرد متقاضی در ویدئو حضور داشته باشد.',
        'ویدئو بدون ماسک ضبط شود.',
        'صورت وسط کادر مشخص شده قرار گرفته شود.',
      ];
    }
    return [];
  });

  onBack() {
    this.back.emit();
  }

  onTakeAgain() {
    this.takeAgain.emit();
  }

  protected readonly WaitingStepperStateEnum = WaitingStepperStateEnum;
}
