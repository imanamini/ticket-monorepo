import { ChangeDetectionStrategy, Component, computed, inject, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCtaItems, CardsCtaItemsModel } from '../../data-access/models/cards-cta-items.model';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { StatusLightDirective } from '@client-monorepo/common/ui-components';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { CardCtaItemMapper, CardCtaItemTitleMapper, CardCtaItemType } from '../../data-access/constants/card-cta-items.const';
import { Overlay } from '@angular/cdk/overlay';
import { CardsCtaMoreItemsBottomSheetComponent } from '../cards-cta-more-items-bottom-sheet/cards-cta-more-items-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'transactions-applet-cards-cta',
  standalone: true,
  imports: [CommonModule, DpIconComponent, StatusLightDirective],
  templateUrl: './cards-cta.component.html',
  styleUrl: './cards-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsCtaComponent {
  // Injections
  bottomSheetService = inject(NgxBottomSheetService);
  actionService = inject(ActionHandlerService);
  overlay = inject(Overlay);

  // Outputs
  itemClicked = output<CardsCtaItemsModel>();

  // Models
  ctaItems = model<CardsCtaItemsModel>({} as CardsCtaItemsModel);

  // Variables
  protected readonly CardCtaItemTitleMapper = CardCtaItemTitleMapper;
  protected readonly CardCtaItemType = CardCtaItemType;
  revisedCtaItems = computed(() => this.reviseCtaItems(this.ctaItems()));
  moreMenuItems = signal<CardCtaItems[]>([]);

  handleItemClick(clickedItem: CardCtaItems, container?: HTMLElement): void {
    if (clickedItem.isDisabled) {
      return;
    }
    if (clickedItem.hasChildren) {
      if (container && clickedItem.children) {
        this.moreMenuItems.set([...clickedItem.children]);
        this.openMenu();
      }
    } else {
      this.actionService.handle(clickedItem.action).then();
    }
  }

  private reviseCtaItems(items: CardsCtaItemsModel): CardsCtaItemsModel {
    if (items && items.actions) {
      if (items?.actions?.length <= 4) {
        return items;
      }
      const mainItems = items.actions.slice(0, 3);
      const extraItems = items.actions.slice(3);
      const moreItem: CardCtaItems = CardCtaItemMapper[CardCtaItemType.MORE];
      moreItem.children = extraItems;
      moreItem.hasChildren = true;
      mainItems.push(moreItem);
      return { cardsType: items.cardsType, actions: mainItems };
    } else {
      return {} as CardsCtaItemsModel;
    }
  }

  openMenu() {
    this.bottomSheetService.openBottomSheet(CardsCtaMoreItemsBottomSheetComponent, { data: this.moreMenuItems() });
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      const item = this.bottomSheetService.outputData()?.item;
      if (item) {
        if (item.action.payload.url === 'support') {
          window.location.href = 'tel:02153924000';
          return;
        }
        this.actionService.handle(item.action);
      }
      bottomSheetSubscriber.unsubscribe();
    });
  }
}
