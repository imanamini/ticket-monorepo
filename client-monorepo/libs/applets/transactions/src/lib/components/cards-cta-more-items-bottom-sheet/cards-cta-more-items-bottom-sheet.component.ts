import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCtaItems } from '../../data-access/models/cards-cta-items.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'transactions-applet-cards-cta-more-items-bottom-sheet',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './cards-cta-more-items-bottom-sheet.component.html',
  styleUrl: './cards-cta-more-items-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsCtaMoreItemsBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  moreMenuItems = signal<CardCtaItems[]>([]);

  constructor() {
    this.moreMenuItems.set(this.bottomSheetService.data().data);
  }

  handleItemClick(item: CardCtaItems): void {
    this.bottomSheetService.outputData.set({ item: item });
    this.bottomSheetService.closeBottomSheet();
  }
}
