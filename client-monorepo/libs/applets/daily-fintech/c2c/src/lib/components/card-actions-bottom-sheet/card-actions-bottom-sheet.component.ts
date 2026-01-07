import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppWindow } from '@client-monorepo/common/utilities';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { buildCardShareText } from '../../utils/card-share-text-builder';
import { CardActionEnum } from '../../data-access/models/card-action.enum';
import { C2cCardHelper } from '../../utils/c2c-card';
import { C2cMainService } from '../../data-access/services/c2c-main.service';

declare const window: AppWindow;

@Component({
  selector: 'c2c-applet-card-actions-bottom-sheet',
  standalone: true,
  imports: [CommonModule, DpIconComponent, ApiImageModule, PipesModule],
  templateUrl: './card-actions-bottom-sheet.component.html',
  styleUrls: ['./card-actions-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardActionsBottomSheetComponent implements OnInit {
  private readonly c2cMainService = inject(C2cMainService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);

  private readonly nav = window.navigator;

  readonly card = computed(() => this.bottomSheetService?.data()?.card);
  readonly type = computed(() => this.bottomSheetService?.data()?.type);
  readonly editable = computed(() => this.bottomSheetService?.data()?.editable);
  readonly shouldShowEdit = computed(() => this.type() === 'source');
  readonly shouldShowPin = computed(() => !this.card()?.pinned);
  readonly shouldShowUnpin = computed(() => this.card()?.pinned);
  readonly shouldShowShapark = computed(() => {
    const bank = this.c2cMainService.findBankByPrefix(this.card().prefix);
    return C2cCardHelper.shouldBeRegistered(this.card(), this.type()) && bank?.active;
  });

  ngOnInit() {
    // Execute immediately after dependency injection
    this.autoSelectEditIfEditable();
  }

  private autoSelectEditIfEditable(): void {
    if (this.editable()) {
      this.selectAction(CardActionEnum.EDIT);
    }
  }

  selectAction(action: CardActionEnum) {
    if (action === CardActionEnum.SHARE) {
      this.shareClick();
      return;
    }
    this.close(action, {});
  }

  shareClick(): void {
    const text = buildCardShareText(this.card());

    if (window.digipayHybridApp?.shareText) {
      window.digipayHybridApp.shareText(text);
      return;
    }

    if (this.nav.share) {
      this.nav.share({ text } as ShareData);
    }
  }

  private close(action: string, data: Record<string, any> = {}): void {
    this.bottomSheetService.outputData.set({ action, ...data });
    this.bottomSheetService.closeBottomSheet();
  }

  protected readonly CardActionEnum = CardActionEnum;
}
