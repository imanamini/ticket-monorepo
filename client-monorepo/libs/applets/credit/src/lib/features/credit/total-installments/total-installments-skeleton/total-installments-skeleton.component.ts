import { Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'app-total-installments-skeleton',
  templateUrl: './total-installments-skeleton.component.html',
  styleUrl: './total-installments-skeleton.component.scss',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent],
})
export class TotalInstallmentsSkeletonComponent {}
