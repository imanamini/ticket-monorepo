import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-total-installments-empty',
  templateUrl: './total-installments-empty.component.html',
  styleUrl: './total-installments-empty.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalInstallmentsEmptyComponent {}
