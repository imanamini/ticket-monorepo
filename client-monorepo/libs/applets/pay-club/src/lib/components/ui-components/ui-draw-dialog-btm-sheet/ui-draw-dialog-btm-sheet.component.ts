import { ChangeDetectorRef, Component, computed, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { DrawStatus } from '../../../data-access/models/reward-status';
import { ClubService } from '../../../data-access/services/club.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { CapacityType } from '../../../data-access/models/capacity-type';
import { UiDialogBtmSheetComponent } from '../ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';
import { UiModernCountdownComponent } from '../ui-modern-countdown/ui-modern-countdown.component';
import { UiMainContentComponent } from '../ui-main-content/ui-main-content.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'pay-club-applet-ui-draw-dialog-btm-sheet',
  standalone: true,
  imports: [CommonModule, UiDialogBtmSheetComponent, UiModernCountdownComponent, UiMainContentComponent, NgxButtonComponent],
  templateUrl: './ui-draw-dialog-btm-sheet.component.html',
  styleUrls: ['./ui-draw-dialog-btm-sheet.component.scss'],
})
export class UiDrawDialogBtmSheetComponent implements OnInit, OnDestroy {
  @Input()
  data!: Prize;

  buttonConfig!: { text: string; disabled: boolean };

  subscriptions: Subscription[] = [];

  generalBalance!: number;

  DrawStatus = DrawStatus;

  readonly remainingTimePurchase = computed(() => {
    // Handle null/undefined data safely
    if (!this.data?.info?.expirationDate) {
      return 0;
    }
    // Prevent negative countdown values
    return Math.max(0, (this.data.info.expirationDate - Date.now()) / 1000);
  });
  readonly remainingTimeExecution = computed(() => {
    if (!this.data?.info?.executionDate) {
      return 0;
    }
    return Math.max(0, (this.data.info.executionDate - Date.now()) / 1000);
  });

  constructor(
    private clubService: ClubService,
    private bottomSheetService: NgxBottomSheetService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    if (!this.bottomSheetService.data()) {
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

  setButton(): void {
    if (this.data.info.capacity.remainingCount === 0 && this.data.info.capacity.type === CapacityType.LIMITED) {
      this.buttonConfig = {
        text: 'ظرفیت این قرعه‌کشی تکمیل شده‌است',
        disabled: true,
      };
    } else if (this.data.acquisitionResult.trackingCode) {
      this.buttonConfig = {
        text: 'شما در این قرعه‌کشی شرکت کرده‌اید',
        disabled: true,
      };
    } else if (this.generalBalance < this.data.info.score) {
      this.buttonConfig = {
        text: 'شما امتیاز کافی ندارید',
        disabled: true,
      };
    } else if (!this.data.acquisitionResult.trackingCode) {
      this.buttonConfig = {
        text: 'شرکت در قرعه‌کشی (' + this.data.info.score + 'سکه)',
        disabled: false,
      };
    }
  }

  clickDrawButton(): void {
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
