import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PlateManagerChange,
  PlateManagerInputData,
  PlateManagerOutputData,
  ScheduleChange,
} from '../../data-access/models/plate-manager-data';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { PlateApiService } from '../../data-access/services/plate-api.service';
import { Observable } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { StoredPlate } from '../../data-access/models/stored-plate';
import { SchedulesApiService } from '../../data-access/services/schedules-api.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-vehicle-data-plate-manager',
  standalone: true,
  imports: [CommonModule, NgxPlateComponent, UiFormFieldBuilderModule, FormsModule, NgxButtonComponent],
  templateUrl: './plate-manager.component.html',
  styleUrl: './plate-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateManagerComponent implements OnInit {
  bottomSheetService = inject<NgxBottomSheetService<PlateManagerOutputData, PlateManagerInputData>>(NgxBottomSheetService);
  mode = signal<'add' | 'edit'>('add');
  plateNo = signal<string>('');
  name = signal<string>('');
  data: PlateManagerInputData | null;
  ctaInProgress = signal<boolean>(false);
  payableAutomatically = signal<boolean>(true);
  isAutoPay = signal<boolean>(true);
  plateApiService = inject(PlateApiService);
  messageService = inject(MessageService);
  scheduleApiService = inject(SchedulesApiService);

  constructor() {
    this.data = this.bottomSheetService.data();
  }

  ngOnInit() {
    if (this.data?.plate) {
      this.mode.set('edit');
      this.plateNo.set(this.data.plate.plateNo);
      this.name.set(this.data.plate.title);
      this.isAutoPay.set(!!this.data.schedule?.uid);
    }
    this.payableAutomatically.set(!!this.data?.hasSchedule);
  }

  onValueChange($event: any) {
    this.plateNo.set($event);
  }

  deletePlate(): void {
    if (this.ctaInProgress()) {
      return;
    }
    this.ctaInProgress.set(true);
    const plate = this.data?.plate;
    if (!plate) {
      return;
    }
    this.checkScheduleForDeletePlate().subscribe(({ success, change }) => {
      if (success) {
        this.plateApiService.deletePlate(this.plateNo()).subscribe(() => {
          this.ctaInProgress.set(false);
          this.closeBottomSheet('delete', plate, change);
        });
      }
    });
  }

  checkScheduleForDeletePlate(): Observable<{ success: boolean; change: ScheduleChange }> {
    return new Observable((subscriber) => {
      if (this.data?.schedule?.uid) {
        this.scheduleApiService.deleteSchedule(this.data?.schedule?.uid).subscribe({
          next: () => {
            subscriber.next({ success: true, change: 'delete' });
          },
          error: (err) => {
            this.handleError(err);
            subscriber.next({ success: false, change: 'no-change' });
          },
        });
      } else {
        return subscriber.next({ success: true, change: 'no-change' });
      }
    });
  }

  checkScheduleAfterCreateOrUpdate(): Observable<ScheduleChange> {
    return new Observable((subscriber) => {
      if (!this.payableAutomatically()) {
        return subscriber.next('no-change');
      }
      if (this.mode() === 'edit' && this.isAutoPay() && !this.data?.schedule?.uid) {
        this.scheduleApiService.createSchedule(this.plateNo()).subscribe({
          next: () => {
            subscriber.next('add');
          },
          error: this.handleError,
        });
        return;
      }
      if (this.mode() === 'edit' && !this.isAutoPay() && this.data?.schedule?.uid) {
        this.scheduleApiService.deleteSchedule(this.data?.schedule?.uid).subscribe({
          next: () => {
            subscriber.next('delete');
          },
          error: this.handleError,
        });
        return;
      }
      subscriber.next('no-change');
    });
  }

  submit(): void {
    if (this.ctaInProgress()) {
      return;
    }
    this.ctaInProgress.set(true);
    const plateNo = this.plateNo();
    const plateId = this.data?.plate?.plateId;
    const title = this.name() || 'خودرو من';
    if (!plateNo) {
      return;
    }
    const apiObservable: Observable<any> =
      this.mode() === 'edit' && plateId
        ? this.plateApiService.updatePlate({ plateNo, plateId, title })
        : this.plateApiService.createPlate({ plateNo, title });
    if (apiObservable) {
      apiObservable.subscribe({
        next: (res) => {
          this.checkScheduleAfterCreateOrUpdate().subscribe({
            next: (change) => {
              this.ctaInProgress.set(false);
              this.closeBottomSheet(this.mode(), res.plate, change);
              this.messageService.showSuccessMessage(res.result.message);
            },
          });
        },
        error: this.handleError,
      });
    }
  }

  closeBottomSheet(changed: PlateManagerChange = 'no-change', plate: StoredPlate, scheduleChange: ScheduleChange) {
    this.bottomSheetService.outputData.set({
      plate,
      changed,
      schedule: scheduleChange,
    });
    this.bottomSheetService.closeBottomSheet();
  }

  handleError(error: any) {
    this.ctaInProgress.set(false);
    this.messageService.showErrorOfErrorResponse(error);
  }
}
