import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'direct-debit-contract-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-activity.component.html',
  styleUrl: './contract-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractActivityComponent {}
