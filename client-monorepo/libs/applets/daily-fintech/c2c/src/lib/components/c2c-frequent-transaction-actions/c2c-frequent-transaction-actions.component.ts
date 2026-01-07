import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { ModifiedC2cFrequentTransaction } from '../../data-access/models/c2c-frequent-transaction-response';
import { C2cFrequentTransactionCardComponent } from '../c2c-frequent-transaction-card/c2c-frequent-transaction-card.component';
import { C2cFrequentTransactionEditComponent } from '../c2c-frequent-transaction-edit/c2c-frequent-transaction-edit.component';

@Component({
  selector: 'c2c-applet-c2c-frequent-transaction-actions',
  standalone: true,
  imports: [CommonModule, DpIconComponent, PipesModule, C2cFrequentTransactionCardComponent],
  templateUrl: './c2c-frequent-transaction-actions.component.html',
  styleUrls: ['./c2c-frequent-transaction-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cFrequentTransactionActionsComponent {
  // Injects
  private c2cMainService = inject(C2cMainService);
  private bottomSheetService = inject(NgxBottomSheetService);

  frequentTransaction = computed<ModifiedC2cFrequentTransaction>(() => this.bottomSheetService.data());

  editClick() {
    this.bottomSheetService.openBottomSheet(C2cFrequentTransactionEditComponent, { ...this.frequentTransaction() }, { noPadding: true });
  }

  deleteClick() {
    this.c2cMainService.handleDeleteFrequentTransaction(this.frequentTransaction()).subscribe({
      next: () => {
        this.bottomSheetService.closeBottomSheet();
      },
    });
  }
}
