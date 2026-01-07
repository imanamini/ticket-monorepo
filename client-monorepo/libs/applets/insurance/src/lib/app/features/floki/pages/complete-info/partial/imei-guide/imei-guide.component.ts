import { Component, inject, signal } from '@angular/core';
import { FlokiHeaderComponent } from '../../../../ui-component/floki-header/floki-header.component';
import { CalloutCheckedComponent } from '../../../callout-checked/callout-checked.component';
import { CalloutModel } from '../../../../models/callout.model';
import { Router } from '@angular/router';
import { CalloutModeEnum } from '../../../callout-checked/models/callout-mode.enum';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'imei-guide',
  standalone: true,
  imports: [
    FlokiHeaderComponent,
    CalloutCheckedComponent,
    NgxButtonComponent
  ],
  templateUrl: './imei-guide.component.html',
  styleUrl: './imei-guide.component.scss'
})
export class ImeiGuideComponent {
  sheet = inject(MatBottomSheet);
  router = inject(Router);
  messages = signal<CalloutModel[]>([{
    title: 'شماره‌گیری کد',
    subTitle: 'کد #06#* را مانند تصویر ۱ شماره‌گیری کنید تا IMEI گوشی شما نمایش داده شود.'
  },
    {
      title: 'اسکرین‌شات یا کپی',
      subTitle: 'از لیست نمایش داده مانند تصویر ۲ اسکرین‌شات تهیه کنید. همچنین در صورت نیاز می‌توانید کد را کپی کرده یا بصورت دستی وارد کنید.'
    }
  ]);
  protected readonly CalloutModeEnum = CalloutModeEnum;

  goToCompleteInfo(): void {
    this.sheet.dismiss();
  }
}
