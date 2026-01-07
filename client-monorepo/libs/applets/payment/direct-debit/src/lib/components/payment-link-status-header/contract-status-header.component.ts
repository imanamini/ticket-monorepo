import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  ContractResultsHeaderConfig,
  ContractResultsHeaderStatusIcon,
  DirectDebitResultResponse,
} from '../../data-access/model/direct-debit.model';

@Component({
  selector: 'direct-debit-status-header',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './contract-status-header.component.html',
  styleUrl: './contract-status-header.component.scss',
})
export class PaymentLinkStatusHeaderComponent {
  readonly status = input<DirectDebitResultResponse['status']>('SUCCESS');
  readonly config = input<ContractResultsHeaderConfig>();
  readonly cellNumber = input<string>();
  data = input<DirectDebitResultResponse>();

  readonly hasError = computed(() => this.status() === 'FAILED');
  readonly isSucceed = computed(() => this.status() === 'SUCCESS');
  readonly hasWarning = computed(() => this.status() === 'CANCELED');

  readonly icon = computed(() => ContractResultsHeaderStatusIcon[this.status()]);
}
