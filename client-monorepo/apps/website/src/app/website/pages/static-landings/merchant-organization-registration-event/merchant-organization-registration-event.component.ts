import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'merchant-organization-registration-event',
  templateUrl: './merchant-organization-registration-event.component.html',
  standalone: true,
  styleUrls: ['./merchant-organization-registration-event.component.scss'],
})
export class MerchantOrganizationRegistrationEventComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/assets/static/landings/merchant-organization-registration-r-event/index.html';
    }
  }
}
