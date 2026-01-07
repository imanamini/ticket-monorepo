import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PlateManagerComponent,
  PlateManagerInputData,
  PlateManagerOutputData,
  StoredPlate,
  TollApiService,
  TollDebt,
  UserSchedule,
} from '@client-monorepo/daily-fintech/vehicle-data';
import { VehicleCardComponent, VehicleCardStatus } from '@client-monorepo/daily-fintech/vehicle-card';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'toll-applet-toll-card',
  standalone: true,
  imports: [CommonModule, VehicleCardComponent],
  templateUrl: './toll-card.component.html',
  styleUrl: './toll-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TollCardComponent implements OnInit {
  tollApiService = inject(TollApiService);
  router = inject(Router);
  private untilDestroy = inject(DestroyRef);
  editPlateBottomSheetService = inject<NgxBottomSheetService<PlateManagerOutputData, PlateManagerInputData>>(NgxBottomSheetService);
  plate = input.required<StoredPlate>();
  debt = signal<TollDebt | null>(null);
  walletBalance = input<number>();
  schedule = input<UserSchedule>();
  insufficientWalletBalance = output<void>();
  status = signal<VehicleCardStatus>('unpaid');
  delete = output<StoredPlate>();
  edit = output<StoredPlate>();
  addSchedule = output<string>();
  deleteSchedule = output<string>();
  isLoading = computed(() => {
    return (!this.plate() || !this.debt()) && this.status() !== 'no-service';
  });
  ngOnInit(): void {
    this.getDebt();
  }

  getDebt(): void {
    const plate = this.plate();
    if (plate) {
      this.tollApiService
        .getTollDebt(plate.plateNo)
        .pipe(takeUntilDestroyed(this.untilDestroy))
        .subscribe({
          next: (res) => {
            this.debt.set(res);
            this.checkInsufficientBalance();
            this.generateStatus();
          },
          error: () => {
            this.status.set('no-service');
          },
        });
    }
  }

  checkInsufficientBalance(): void {
    const debt = this.debt();
    if (debt && this.schedule() && (this.walletBalance() || 0) < debt.amount) {
      this.insufficientWalletBalance.emit();
    }
  }

  generateStatus(): void {
    const debt = this.debt();
    const schedule = this.schedule();
    const balance = this.walletBalance() || 0;
    if (!debt || !debt.result || [0, 1000, 9101].indexOf(debt.result.status) < 0) {
      this.status.set('no-service');
      return;
    }
    if (!debt.amount) {
      this.status.set('paid');
      return;
    }
    if (!schedule) {
      this.status.set(debt.amount ? 'unpaid' : 'paid');
      return;
    }
    this.status.set(debt.amount > balance ? 'not-enough-balance' : 'paying');
  }

  onEdit() {
    this.editPlateBottomSheetService.openBottomSheet(PlateManagerComponent, {
      plate: this.plate(),
      schedule: this.schedule(),
      hasSchedule: true,
    });
    const bottomSheetSubscriber = this.editPlateBottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
      const outputData = this.editPlateBottomSheetService.outputData();
      if (outputData?.changed === 'delete') {
        this.delete.emit(this.plate());
      }
      if (outputData?.changed === 'edit' && outputData.plate) {
        this.edit.emit(outputData.plate);
        if (outputData?.schedule === 'add') {
          this.addSchedule.emit(outputData.plate.plateNo);
        }
        if (outputData?.schedule === 'delete') {
          this.deleteSchedule.emit(outputData.plate.plateNo);
        }
      }
    });
  }

  onCtaClick(): void {
    const tollDebt = this.debt();
    if (this.status() === 'unpaid' && tollDebt) {
      this.router
        .navigate(['toll', 'confirm'], {
          state: {
            toll: tollDebt,
          },
        })
        .then();
    }
  }
}
