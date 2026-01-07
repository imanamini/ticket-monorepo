import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentLinkStatusHeaderComponent } from '../../components/payment-link-status-header/contract-status-header.component';
import { ContractResultsErrorTranslate, ContractResultsHeaderConfig } from '../../data-access/model/direct-debit.model';
import { DirectDebitService } from '../../data-access/services/direct-debit.service';
import { NgxAppBarComponent } from "@digipay/ngx-app-bar";

@Component({
  selector: 'direct-debit-contract-results',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxButtonComponent, PaymentLinkStatusHeaderComponent, NgxAppBarComponent],
  templateUrl: './contract-results.component.html',
  styleUrl: './contract-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DirectDebitService],
})
export class ContractResultsComponent implements OnInit, OnDestroy {
  private service = inject(DirectDebitService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  decodedData: any = null;
  config!: ContractResultsHeaderConfig;

  ngOnInit(): void {
    this.decodeData();
  }
  private decodeData(): void {
    const b64 = this.route.snapshot.queryParams['data'];
    if (!b64) {
      this.decodedData = null;
      return;
    }
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    this.decodedData = JSON.parse(new TextDecoder().decode(bytes));
    const status = this.decodedData.status as keyof typeof ContractResultsErrorTranslate;
    this.config = ContractResultsErrorTranslate[status];
  }

  onNavigate(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    if (this.decodedData.status === 'SUCCESS') {
      this.service.clearState();
    }
  }
}
