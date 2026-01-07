import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SignalClient } from '@digipay/ng-payment';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { Subscription } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { ClubService } from '../../../data-access/services/club.service';
import { convertDurationTime } from '../../../data-access/utils/time';
import { UiDialogBtmSheetComponent } from '../ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';
import { UiMainContentComponent } from '../ui-main-content/ui-main-content.component';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'pay-club-applet-ui-voucher-dialog-btm-sheet',
  standalone: true,
  imports: [CommonModule, UiDialogBtmSheetComponent, UiMainContentComponent, DpIconComponent, NgxButtonComponent],
  templateUrl: './ui-voucher-dialog-btm-sheet.component.html',
  styleUrls: ['./ui-voucher-dialog-btm-sheet.component.scss'],
})
export class UiVoucherDialogBtmSheetComponent implements OnInit, OnDestroy {
  @Input()
  data!: Prize;

  copied = false;

  buttonConfig!: { text: string; disabled: boolean };

  subscriptions: Subscription[] = [];

  generalBalance!: number;

  constructor(
    private clubService: ClubService,
    private messageService: MessageService,
    private bottomSheetService: NgxBottomSheetService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (!this.data) {
      this.data = this.bottomSheetService.data();
    }
  }

  ngOnInit(): void {
    const balanceSubscribe = this.clubService.generalBalance.subscribe((balance) => {
      this.generalBalance = balance;
      this.setButton();
      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.push(balanceSubscribe);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  setDurationTime(): number {
    // todo check nowTime value
    const nowTime = Date.now();
    const nextAllowedTime = this.data.acquisitionResult.nextAllowedAcquireTime;
    return nextAllowedTime > 0 ? nextAllowedTime - nowTime : nextAllowedTime;
  }

  setButton(): void {
    const duration = this.setDurationTime();
    if (this.data.info.capacity.remainingCount === 0) {
      this.buttonConfig = {
        text: 'ظرفیت تکمیل شده‌است',
        disabled: true,
      };
    } else if (this.generalBalance < this.data.info.score) {
      this.buttonConfig = {
        text: 'شما امتیاز کافی ندارید',
        disabled: true,
      };
    } else if (duration <= 0) {
      this.buttonConfig = {
        text: 'دریافت کد (' + this.data.info.score + 'سکه)',
        disabled: false,
      };
    } else if (duration > 0) {
      this.buttonConfig = {
        text: convertDurationTime(duration) + ' تا خرید مجدد کد',
        disabled: true,
      };
    }
  }

  async copyCode(): Promise<any> {
    try {
      this.copied = true;
      SignalClient.copyToClipboard(this.data.acquisitionResult.code);
      await navigator.clipboard.writeText(this.data.acquisitionResult.code);
    } catch (err) {
      // handle error
    }
  }

  clickRewardButton(): void {
    this.clubService
      .getReward(this.data.info.type, this.data.info.groupId)
      .then((response) => {
        this.data = {
          acquisitionResult: response.details,
          info: {
            ...this.data.info,
            capacity: { ...this.data.info.capacity, remainingCount: this.data.info.capacity.remainingCount - 1 },
          },
        };
        this.clubService.getClubReward(true);
        this.changeDetectorRef.detectChanges();
      })
      .catch((e) => {
        if (!e || !e.error.result) {
          this.buttonConfig.disabled = true;
          this.messageService.showErrorMessage('خطاي ارتباط با سرور');
          return;
        }
        this.buttonConfig.disabled = true;
        this.messageService.showErrorOfErrorResponse(e);
        this.changeDetectorRef.detectChanges();
      });
  }
}
