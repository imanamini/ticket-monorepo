import { Component, inject, OnInit } from '@angular/core';
import { NgxNoticeService, NoticeData, noticeResult } from '@digipay/ngx-notice';

@Component({
  selector: 'app-no-ticket',
  templateUrl: './no-ticket.component.html',
  styleUrls: ['./no-ticket.component.scss']
})
export class NoTicketComponent implements OnInit {
  noticeService = inject(NgxNoticeService);

  constructor() {
  }

  ngOnInit(): void {
    const dialogData: NoticeData = {
      state: 'info',
      description: 'زمان دسترسی شما پایان یافت. لطفا از طریق پنل فروشندگان دیجی‌کالا مجدد وارد شوید.',
      title: 'زمان شما به اتمام رسید',
      width: '328px',
      primaryButtonLabel: 'ورود مجدد',
      primaryButtonStyle: 'fill',
      isHorizontalAction: true,
      position: 'bottom-center'
    };
    this.noticeService.openModal(dialogData);
    const afterClosedSubject = this.noticeService.afterClosed();
    if (afterClosedSubject) {
      const subscription = afterClosedSubject.subscribe((data: noticeResult) => {
        this.exit();
        subscription.unsubscribe();
      });
    }
  }

  exit() {
    const businessRegistrationUrl: any = sessionStorage.getItem('businessUrl');
    if (businessRegistrationUrl) {
      window.location.replace(businessRegistrationUrl);
    }
  }
}
