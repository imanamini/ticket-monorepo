import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'direct-debit-contract-create-loading',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './contract-create-loading.component.html',
  styleUrl: './contract-create-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractCreateLoadingComponent {}
