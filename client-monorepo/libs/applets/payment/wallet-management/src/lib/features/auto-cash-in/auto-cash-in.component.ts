import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectDebitFormComponent } from '../../components/direct-debit-form/direct-debit-form.component';

@Component({
  selector: 'wallet-mng-applet-auto-cash-in',
  standalone: true,
  imports: [CommonModule, DirectDebitFormComponent],
  templateUrl: './auto-cash-in.component.html',
  styleUrl: './auto-cash-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoCashInComponent {}
