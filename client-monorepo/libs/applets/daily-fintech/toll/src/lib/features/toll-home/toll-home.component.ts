import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import {
  AutoPayComponent,
  PlateApiService,
  PlateManagerComponent,
  PlateManagerInputData,
  PlateManagerOutputData,
  SchedulesApiService,
  StoredPlate,
  UserSchedule
} from '@client-monorepo/daily-fintech/vehicle-data';
import { TollCardComponent } from '../../components/toll-card/toll-card.component';
import { WalletApiService } from '@client-monorepo/payment/wallet';
import {
  InsufficientWalletBalanceMessageComponent
} from '../../components/insufficient-wallet-balance-message/insufficient-wallet-balance-message.component';
import { NgxButtonComponent, NgxFabComponent } from '@digipay/ngx-button';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { DailyFintechTouchPointComponent } from '@client-monorepo/shared/daily-fintech/touch-point';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

export interface StoredPlateWithSchedule extends StoredPlate {
  schedule?: UserSchedule;
}

@Component({
  selector: 'toll-applet-toll-home',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TollCardComponent,
    InsufficientWalletBalanceMessageComponent,
    NgxFabComponent,
    NgxSkeletonLoadingComponent,
    DailyFintechTouchPointComponent,
    NgxButtonComponent
  ],
  templateUrl: './toll-home.component.html',
  styleUrl: './toll-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TollHomeComponent implements OnInit {
  plateApiService = inject(PlateApiService);
  walletApiService = inject(WalletApiService);
  plateList = signal<StoredPlate[]>([]);
  gettingPlates = signal(true);
  gettingSchedule = signal(true);
  gettingWalletBalance = signal(true);
  schedulesMap = signal<{ [key: string]: UserSchedule }>({});
  walletBalance = signal<number>(0);
  insufficientWalletBalance = signal(false);
  isStableData = computed(() => {
    return !this.gettingSchedule() && !this.gettingWalletBalance() && !this.gettingPlates();
  });
  bottomSheetService = inject<NgxBottomSheetService<PlateManagerOutputData, PlateManagerInputData>>(NgxBottomSheetService);
  schedulesApiService = inject(SchedulesApiService);
  plateListWithSchedule = computed<StoredPlateWithSchedule[]>(() => {
    return this.plateList().map((plate) => {
      return { ...plate, schedule: this.schedulesMap()[plate.plateNo] };
    });
  });

  ngOnInit() {
    this.getUserWalletBalance();
    this.getPlates();
    this.getSchedules();
  }

  getUserWalletBalance() {
    this.gettingWalletBalance.set(true);
    this.walletApiService.getWalletBalance().subscribe((res) => {
      this.walletBalance.set(res.amount);
      this.gettingWalletBalance.set(false);
    });
  }

  getPlates() {
    this.gettingPlates.set(true);
    this.plateApiService.getPlates().subscribe((res) => {
      this.plateList.set(res.plates);
      this.gettingPlates.set(false);
    });
  }

  getSchedules() {
    this.gettingSchedule.set(true);
    this.schedulesApiService.getSchedules().subscribe((res) => {
      const scheduleMap: { [key: string]: UserSchedule } = {};
      res.schedules.forEach((schedule) => {
        if (schedule.payload?.plateNo) {
          scheduleMap[schedule.payload.plateNo] = schedule;
        }
      });
      this.schedulesMap.set(scheduleMap);
      this.gettingSchedule.set(false);
    });
  }

  setInsufficientWalletBalance() {
    this.insufficientWalletBalance.set(true);
  }

  addNewVehicle() {
    this.bottomSheetService.openBottomSheet(PlateManagerComponent, {
      hasSchedule: true,
    });
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
      const outputData = this.bottomSheetService.outputData();
      if (outputData?.changed === 'add' && outputData?.plate) {
        this.bottomSheetService.openBottomSheet(AutoPayComponent, {
          plate: outputData?.plate,
          hasSchedule: true,
        });
        const bottomSheetSubscriberAutoPay = this.bottomSheetService.onClose.subscribe(() => {
          bottomSheetSubscriberAutoPay.unsubscribe();
          const outputDataBottomSheetAutoPay = this.bottomSheetService.outputData();
          this.plateList.update((plates) => {
            if (outputDataBottomSheetAutoPay?.plate) {
              return [outputDataBottomSheetAutoPay.plate, ...(plates || [])];
            }
            return plates;
          });
          if (outputDataBottomSheetAutoPay?.schedule === 'add') {
            this.addNewSchedule(outputDataBottomSheetAutoPay?.plate?.plateNo);
          } else {
            this.getSchedules();
          }
        });
      }
    });
  }

  addNewSchedule(plateNo?: string) {
    if (!plateNo) {
      return;
    }
    this.schedulesApiService.getScheduleDetail(plateNo).subscribe((schedule) => {
      if (schedule) {
        this.schedulesMap.update((data) => {
          data = data || {};
          data[plateNo] = schedule;
          return { ...data };
        });
      }
    });
  }

  deleteSchedule(plateNo?: string) {
    if (!plateNo) {
      return;
    }
    this.schedulesMap.update((data) => {
      if (data[plateNo]) {
        delete data[plateNo];
        return data;
      }
      return { ...data };
    });
  }

  onDelete(deletedPlate: StoredPlate) {
    this.plateList.update((plates) => {
      return plates.filter((plate) => plate.plateId !== deletedPlate.plateId);
    });
  }

  onEdit(editedPlate: StoredPlate) {
    this.plateList.update((plates) => {
      const foundIndex = plates.findIndex((p) => p.plateId === editedPlate.plateId);
      if (foundIndex !== -1) {
        plates[foundIndex] = editedPlate;
      }
      return [...plates];
    });
  }

  protected readonly AssetTypes = AssetTypes;
}
