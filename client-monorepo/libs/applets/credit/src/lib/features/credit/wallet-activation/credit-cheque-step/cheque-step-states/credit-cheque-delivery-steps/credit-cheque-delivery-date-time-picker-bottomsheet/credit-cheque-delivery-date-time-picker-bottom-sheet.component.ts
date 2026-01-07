import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditHorizontalScrollComponent } from '../../../../../components/credit-horizontal-scroll/credit-horizontal-scroll.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import moment from 'jalali-moment';
import { CreditPersianDatePipe } from '../../../../../data-access/pipes/credit-persian-date.pipe';
import {
  ChequeStepDeliveryMethod,
  DeliveryDate,
  SelectedAddressModel,
  TimeSlot,
} from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../../data-access/services/message.service';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'app-credit-cheque-delivery-date-time-picker-bottom-sheet',
  templateUrl: './credit-cheque-delivery-date-time-picker-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-delivery-date-time-picker-bottom-sheet.component.scss'],
  imports: [
    NgxBottomSheetHeaderComponent,
    CreditHorizontalScrollComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditPersianDatePipe,
    NgxBadgeModule,
    NgxSkeletonLoadingComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryDateTimePickerBottomSheetComponent implements OnInit {
  loading = signal(true);
  availableDates = signal<(DeliveryDate & { disabled: boolean })[]>([]);
  availableTimeSlots = signal<(TimeSlot & { disabled: boolean })[]>([]);

  selectedDate = signal<DeliveryDate | undefined>(undefined);
  selectedTime = signal<TimeSlot | undefined>(undefined);

  private bottomSheetService = inject(NgxBottomSheetService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private creditChequeStepService = inject(CreditChequeStepService);

  chequeDeliveryMethod = computed(() => this.creditChequeStepService.selectedChequeDeliveryMethod());
  title = computed(() => (this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER ? 'زمان مراجعه پیک' : 'زمان حضور در شعبه'));

  reshapedDates = computed(() => {
    return this.availableDates().map((item) => ({
      ...item,
      classSignal: computed(() => {
        if (item.date === this.selectedDate()?.date) {
          return ['border-color-brand', 'surface-brand-tint'];
        } else if (item.disabled) {
          return ['border-color-air'];
        } else {
          return ['surface-elevated', 'border-color-light', 'cursor-pointer'];
        }
      }),
    }));
  });

  reshapedTimeSlots = computed(() => {
    return this.availableTimeSlots().map((item) => ({
      ...item,
      classSignal: computed(() => {
        if (item.id === this.selectedTime()?.id) {
          return ['border-color-brand', 'surface-brand-tint'];
        } else if (item.disabled) {
          return ['surface-elevated', 'border-color-air'];
        } else {
          return ['surface-elevated', 'border-color-light', 'cursor-pointer'];
        }
      }),
    }));
  });

  ngOnInit() {
    if (this.bottomSheetService.data()) {
      if (this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.IN_PERSON) {
        const dates = this.fillMissingDaysUntil7Enabled(this.bottomSheetService.data().dates);
        this.availableDates.set(dates);
        this.setAvailableTimeSlots(dates[0]);
        this.loading.set(false);
        return;
      }
      if (this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER) {
        this.getAvailablePickupDatesByCityId(this.bottomSheetService.data().pickupAddress);
        return;
      }
    }
  }

  getAvailablePickupDatesByCityId(pickupAddress: SelectedAddressModel) {
    this.loading.set(true);
    this.creditApiService.getAvailablePickupDatesByCityId(pickupAddress.cityId).subscribe({
      next: (response) => {
        const dates = this.fillMissingDaysUntil7Enabled(response.items);
        this.availableDates.set(dates);
        this.setAvailableTimeSlots(dates[0]);
        this.loading.set(false);
      },
      error: (error) => {
        if (error.result.status === this.creditChequeStepService.CREDIT_ONB_PICK_UP_CAPACITY_IS_FULL) {
          this.bottomSheetService.outputData.set({ capacityError: true });
          this.bottomSheetService.closeBottomSheet();
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  getAvailablePickupDatesByProviderId(providerId: number) {
    this.loading.set(true);
    this.creditApiService.getAvailablePickupDatesByCityId(providerId).subscribe({
      next: (response) => {
        const dates = this.fillMissingDaysUntil7Enabled(response.items);
        this.availableDates.set(dates);
        this.setAvailableTimeSlots(dates[0]);
        this.loading.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  setAvailableTimeSlots(date: DeliveryDate, setTime?: boolean) {
    this.availableTimeSlots.set(
      date.timeSlots.map((item) => ({
        title: `ساعت ${item.fromTime} الی ${item.toTime}`,
        id: item.id,
        disabled: false,
        toTime: item.toTime,
        fromTime: item.fromTime,
      })),
    );
    if (setTime && this.availableTimeSlots().length === 1) {
      this.selectedTime.set(this.availableTimeSlots()[0]);
    }
  }

  selectDate(date: DeliveryDate & { disabled: boolean }) {
    if (!date.disabled) {
      this.selectedDate.set(date);
      this.setAvailableTimeSlots(date, true);
    }
  }

  selectTimeSlot(timeSlot: TimeSlot & { disabled: boolean }) {
    if (!timeSlot.disabled) {
      this.selectedTime.set(timeSlot);
    }
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  confirm() {
    this.bottomSheetService.outputData.set({
      selectedDate: this.selectedDate(),
      selectedTime: this.selectedTime(),
    });
    this.bottomSheetService.closeBottomSheet();
  }

  private fillMissingDaysUntil7Enabled(data: DeliveryDate[]): (DeliveryDate & { disabled: boolean })[] {
    if (data.length === 0) return [];

    const sorted = data.slice().sort((a, b) => a.date - b.date);

    const startDate = new Date(sorted[0].date);
    const endDate = new Date(sorted[sorted.length - 1].date);

    const dataMap = new Map<string, DeliveryDate>();
    for (const item of sorted) {
      const date = new Date(item.date);
      const key = date.toISOString().split('T')[0];
      dataMap.set(key, item);
    }

    const result: (DeliveryDate & { disabled: boolean })[] = [];
    let enabledCount = 0;
    const current = new Date(startDate);

    while (current <= endDate && enabledCount < 7) {
      const key = current.toISOString().split('T')[0];

      if (dataMap.has(key)) {
        result.push({
          ...dataMap.get(key)!,
          disabled: false,
        });
        enabledCount++;
      } else {
        result.push({
          date: current.getTime(),
          weekDay: current.getDay(),
          timeSlots: [],
          disabled: true,
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  protected readonly moment = moment;
}
