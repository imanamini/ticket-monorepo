import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  FineApiService,
  FinePlate,
  PlateManagerComponent,
  PlateManagerInputData,
  PlateManagerOutputData,
} from '@client-monorepo/daily-fintech/vehicle-data';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { FineCardComponent } from '../../components/fine-card/fine-card.component';
import { Router } from '@angular/router';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { DailyFintechTouchPointComponent } from '@client-monorepo/shared/daily-fintech/touch-point';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'fine-applet-fine-home',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgxSkeletonLoadingComponent,
    FineCardComponent,
    TitleSummaryComponent,
    DailyFintechTouchPointComponent,
    NgxButtonComponent,
  ],
  templateUrl: './fine-home.component.html',
  styleUrl: './fine-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FineHomeComponent implements OnInit {
  fineApiService = inject(FineApiService);
  router = inject(Router);
  plateList = signal<FinePlate[]>([]);
  gettingPlates = signal(true);
  isStableData = computed(() => {
    return !this.gettingPlates();
  });
  bottomSheetService = inject<NgxBottomSheetService<PlateManagerOutputData, PlateManagerInputData>>(NgxBottomSheetService);

  ngOnInit() {
    this.getPlates();
  }

  getPlates() {
    this.gettingPlates.set(true);
    this.fineApiService.getFinePlates().subscribe((res) => {
      this.plateList.set(res.plates);
      this.gettingPlates.set(false);
    });
  }

  addNewVehicle() {
    this.bottomSheetService.openBottomSheet(PlateManagerComponent, {
      hasSchedule: false,
    });
    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
      const outputData = this.bottomSheetService.outputData();
      if (outputData?.changed === 'add') {
        this.router.navigate(['fine', 'select-method', outputData.plate?.plateNo]).then();
        return;
      }
      if (outputData?.changed !== 'no-change') {
        this.getPlates();
      }
    });
  }

  onDelete(deletedPlate: FinePlate) {
    this.plateList.update((plates) => {
      return plates.filter((plate) => plate.plateId !== deletedPlate.plateId);
    });
  }

  onEdit() {
    this.getPlates();
  }

  goToHome() {
    this.router.navigateByUrl('/').then();
  }

  protected readonly AssetTypes = AssetTypes;
}
