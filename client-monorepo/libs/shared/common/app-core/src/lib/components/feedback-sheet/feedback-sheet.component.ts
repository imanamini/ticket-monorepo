import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { StorageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { feedBackParamsModel } from '../../data-access/models/open-feedback.interface';

@Component({
  selector: 'dpx-feedback-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './feedback-sheet.component.html',
  styleUrl: './feedback-sheet.component.scss',
})
export class FeedbackSheetComponent {
  private bottomSheetService = inject(NgxBottomSheetService);
  private actionHandlerService = inject(ActionHandlerService);
  private storageService = inject(StorageService);
  feedBackData!: feedBackParamsModel;
  constructor() {
    this.getAndSetData();
  }

  private getAndSetData(): void {
    this.feedBackData = this.bottomSheetService.data().feedBackData;
  }
  private closeBottomSheet(): void {
    this.bottomSheetService.closeBottomSheet();
  }
  onButtonClicked(): void {
    this.actionHandlerService
      .handle({ type: ActionType.REDIRECT, payload: { url: this.transformUrl(this.feedBackData.buttonLink) } })
      .then(() => {
        this.closeBottomSheet();
      });
  }

  private transformUrl(url: string): string {
    const replaceValue = '{{uid}}';
    if (url.indexOf(replaceValue) >= 0) {
      return url.replace(replaceValue, this.storageService.getUserId());
    }
    return url;
  }

  onRejectClicked(): void {
    this.closeBottomSheet();
  }
}
