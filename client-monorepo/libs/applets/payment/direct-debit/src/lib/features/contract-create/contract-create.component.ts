import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractCreateFormComponent } from '../../components/contract-create-form/contract-create-form.component';
import { DirectDebitService } from '../../data-access/services/direct-debit.service';
import { DirectDebitApiService } from '../../data-access/services/direct-debit-api.service';

@Component({
  selector: 'direct-debit-contract-create',
  standalone: true,
  imports: [CommonModule, ContractCreateFormComponent],
  templateUrl: './contract-create.component.html',
  styleUrl: './contract-create.component.scss',
  providers: [DirectDebitService, DirectDebitApiService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractCreateComponent {}
