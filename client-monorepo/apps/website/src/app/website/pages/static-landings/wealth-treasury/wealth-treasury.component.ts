import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'wealth-treasury',
  template: '<div>Wealth treasury</div>',
  standalone: true,
})
export class WealthTreasuryComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/assets/static/landings/wealth-treasury/index.html';
    }
  }
}
