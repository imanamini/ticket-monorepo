import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconStateType, NgxStatusResultModule, StateType } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { IllustrationIconType, IllustrationModeType, NgxIllustrationIcon } from '@digipay/ngx-illustration-icon';
import { EventManagementService } from '@client-monorepo/common/event-management';

export type ErrorType = 'SERVICE_UNAVAILABLE' | 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'SERVER_ERROR' | 'MAINTENANCE' | 'HAS_PASSWORD';

interface ErrorConfig {
  title: string;
  description: string;
  type: StateType;
  iconState?: IconStateType;
  buttons: Buttons[];
  illustration?: { icon: IllustrationIconType; mode: IllustrationModeType };
}

@Component({
  selector: 'pillar-error-state',
  standalone: true,
  imports: [CommonModule, NgxStatusResultModule, NgxIllustrationIcon],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent implements OnInit {
  private eventService = inject(NgxEventTrackerService);
  private eventManagementService = inject(EventManagementService);

  retry = output<void>();

  errorType = input<ErrorType>('SERVICE_UNAVAILABLE');

  config = computed(() => this.getErrorConfig(this.errorType()));

  ngOnInit() {
    // Track service unavailable view event
    this.eventService.sendEvent({
      eventName: 'UnavailableService',
      eventData: {},
    });
    this.eventManagementService.triggerEvent({
      eventType: 'pageView',
      data: {
        url: window.location.pathname,
      },
      meta: `errorType:${this.errorType()}`,
    });
  }

  private getErrorConfig(type: ErrorType): ErrorConfig {
    const configs: Record<ErrorType, ErrorConfig> = {
      SERVICE_UNAVAILABLE: {
        title: 'سرویس دهنده در دسترس نیست',
        description: 'در حال حاضر امکان برقراری ارتباط وجود ندارد. لطفا دوباره تلاش کنید.',
        type: 'Status',
        iconState: 'retry',
        buttons: [
          {
            id: 'retry',
            mode: 'section',
            style: 'fill',
            label: 'تلاش دوباره',
          },
        ],
      },
      NETWORK_ERROR: {
        title: 'خطا در اتصال به اینترنت',
        description: 'لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.',
        type: 'Status',
        iconState: 'retry',
        buttons: [
          {
            id: 'retry',
            mode: 'section',
            style: 'fill',
            label: 'تلاش دوباره',
          },
        ],
      },
      TIMEOUT_ERROR: {
        title: 'زمان درخواست به پایان رسید',
        description: 'درخواست شما بیش از حد طول کشید. لطفا دوباره تلاش کنید.',
        type: 'Status',
        iconState: 'retry',
        buttons: [
          {
            id: 'retry',
            mode: 'section',
            style: 'fill',
            label: 'تلاش دوباره',
          },
        ],
      },
      SERVER_ERROR: {
        title: 'خطا در سرور',
        description: 'مشکلی در سرور پیش آمده است. لطفا دوباره تلاش کنید.',
        type: 'Status',
        iconState: 'retry',
        buttons: [
          {
            id: 'retry',
            mode: 'section',
            style: 'fill',
            label: 'تلاش دوباره',
          },
        ],
      },
      MAINTENANCE: {
        title: 'سرویس در حال بروزرسانی',
        description: 'سرویس به صورت موقت در دسترس نیست. لطفا بعدا تلاش کنید.',
        type: 'Status',
        iconState: 'info',
        buttons: [],
      },
      HAS_PASSWORD: {
        title: 'این سرویس در حال راه‌اندازی است',
        description: 'امکان استفاده از این بخش هنوز برای همه کاربران فعال نشده و به زودی در دسترس شما قرار خواهد گرفت.',
        type: 'Illustration',
        buttons: [],
        illustration: {
          icon: 'rocket',
          mode: 'info',
        },
      },
    };

    return configs[type];
  }

  onCtaClick($event: string) {
    if ($event === 'retry') {
      // Track retry click event
      this.eventService.sendEvent({
        eventName: 'RetryClick',
        eventData: {},
      });
      this.eventManagementService.triggerEvent({
        eventType: 'click',
        data: {
          target: 'retry-button',
        },
      });

      this.retry.emit();
    }
  }
}
