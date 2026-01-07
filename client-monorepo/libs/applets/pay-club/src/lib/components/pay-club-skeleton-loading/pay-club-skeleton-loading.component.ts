import { Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'pay-club-applet-skeleton-loading',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent],
  templateUrl: './pay-club-skeleton-loading.component.html',
  styleUrl: './pay-club-skeleton-loading.component.scss',
})
export class PayClubSkeletonLoadingComponent {}
