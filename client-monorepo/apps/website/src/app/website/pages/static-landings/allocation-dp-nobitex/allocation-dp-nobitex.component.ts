import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'allocation-dp-nobitex',
  templateUrl: './allocation-dp-nobitex.component.html',
  standalone: true,
  styleUrls: ['./allocation-dp-nobitex.component.scss'],
})
export class AllocationDpNobitexComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = '/assets/static/landings/allocationDp-nobitex/index.html';
    }
  }
}
