import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VouchersListComponent } from '@client-monorepo/vouchers';

@Component({
  selector: 'stores-applet-all-vouchers',
  standalone: true,
  imports: [CommonModule, VouchersListComponent],
  templateUrl: './all-vouchers.component.html',
  styleUrl: './all-vouchers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllVouchersComponent {}
