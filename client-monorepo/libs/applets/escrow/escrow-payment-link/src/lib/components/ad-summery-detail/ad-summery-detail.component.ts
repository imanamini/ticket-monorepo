import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentLinkSaleAdInfo } from '../../data-access/model/payment-link-create.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { RouterLink } from '@angular/router';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-payment-link-ad-summery-detail',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, RouterLink],
  templateUrl: './ad-summery-detail.component.html',
  styleUrl: './ad-summery-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdSummeryDetailComponent implements OnInit {
  data = input.required<PaymentLinkSaleAdInfo>();
  linkId = input<string | undefined>('');
  zone = signal<string>('merchant-app');
  storageService = inject(EscrowStorageService);

  ngOnInit(): void {
    this.getZone();
  }

  getZone(): void {
    this.zone.set((this.storageService.getItem('zone') ?? 'app') as string);
  }
}
