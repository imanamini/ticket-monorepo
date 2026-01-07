import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-digital-sign-redirection',
  templateUrl: './digital-sign-redirection.component.html',
  styleUrls: ['./digital-sign-redirection.component.scss']
})
export class DigitalSignRedirectionComponent implements OnInit {

  targetUrl: string;
  status: null | 'INVALID_URL' | 'MI_ERROR' | 'HUAWEI_ERROR';
  dataMap = {
    INVALID_URL: {
      title: 'مقصد جابجایی نامعتبر است',
      description: '',
      cta: {
        label: 'متوجه شدم',
        action: 'close'
      }
    },
    MI_ERROR: {
      title: 'ادامه فرایند برای گوشی‌های شیاومی',
      description: 'ساخت امضای دیجیتال در مرورگر Mi Browser ممکن نیست. برای ادامه اپلیکیشن دیجی‌پی را دانلود کنید و وارد بخش دریافت وام شوید.',
      cta: {
        label: 'دانلود اپلیکیشن',
        action: 'download_app'
      }
    },
    HUAWEI_ERROR: {
      title: 'ادامه فرایند برای گوشی‌های هواوی',
      description: 'ساخت امضای دیجیتال در مرورگر Huawei Browser ممکن نیست. برای ادامه اپلیکیشن دیجی‌پی را دانلود کنید و وارد بخش دریافت وام شوید.',
      cta: {
        label: 'دانلود اپلیکیشن',
        action: 'download_app'
      }
    },
  };

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.targetUrl = queryParams.targetUrl;
    this.status = this.generateStatus();
    if (!this.status) {
      this.redirect();
    }
  }

  generateStatus(): null | 'INVALID_URL' | 'MI_ERROR' | 'HUAWEI_ERROR' {
    if (!this.targetUrl) {
      return 'INVALID_URL';
    }
    if (this.isMiBrowser()) {
      return 'MI_ERROR';
    }
    if (this.isHuaweiBrowser()) {
      return 'HUAWEI_ERROR';
    }
    return null;
  }

  isMiBrowser(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /xiaomi/.test(userAgent);
  }

  isHuaweiBrowser(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('huawei') || userAgent.includes('honor');
  }

  redirect() {
    window.location.replace(this.targetUrl);
  }

  close(): void {
    window.close();
  }

  onCtaClick(action: string) {
    if (action === 'download_app') {
      window.location.replace('https://www.mydigipay.com/download/');
      return;
    }
    if (action === 'close') {
      this.close();
    }
  }
}
