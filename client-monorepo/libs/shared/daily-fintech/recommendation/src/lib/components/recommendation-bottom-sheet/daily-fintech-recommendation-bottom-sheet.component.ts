import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { CellNumberItemBottomSheetService } from '@client-monorepo/common/cellular-operator';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { MessageService } from '@client-monorepo/common/utilities';
import {
  RECOMMENDATION_TYPES,
  RecommendationApiService,
  RecommendationData
} from '@client-monorepo/daily-fintech/recommendation';
import {
  DailyFintechRecommendationEditComponent
} from '../recommendation-edit/daily-fintech-recommendation-edit.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'daily-fintech-recommendation-bottom-sheet',
  standalone: true,
  imports: [CommonModule, DpIconComponent, ApiImageModule],
  templateUrl: './daily-fintech-recommendation-bottom-sheet.component.html',
  styleUrls: ['./daily-fintech-recommendation-bottom-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechRecommendationBottomSheetComponent {
  cellNumber!: RecommendationData;

  type!: RECOMMENDATION_TYPES;

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private messageService: MessageService,
    private cellNumberItemBottomSheetService: CellNumberItemBottomSheetService,
    private recommendationApiService: RecommendationApiService,
  ) {
    if (this.bottomSheetService.data().cellNumber) {
      this.cellNumber = this.bottomSheetService.data().cellNumber;
      if (typeof this.bottomSheetService.data().type !== 'undefined') {
        this.type = this.bottomSheetService.data().type;
      }
    }
  }

  unpinClick() {
    this.togglePinStatus(false);
  }

  pinClick() {
    this.togglePinStatus(true);
  }

  private togglePinStatus(pin: boolean) {
    this.recommendationApiService
      .updateStoredBill(this.type, {
        pinned: pin,
        id: this.cellNumber.id,
        alias: this.cellNumber.title,
      })
      .subscribe(
        (response) => {
          this.close();
          this.messageService.showSuccessMessage(response.result.message);
          this.cellNumberItemBottomSheetService.reload();
        },
        (e) => {
          this.showErrorIfExists(e);
        },
      );
  }

  deleteClick() {
    this.recommendationApiService.deleteBill(this.type, this.cellNumber.id).subscribe(
      (response) => {
        this.close();
        this.messageService.showSuccessMessage(response.result.message);
        this.cellNumberItemBottomSheetService.reload();
      },
      (e) => {
        this.showErrorIfExists(e);
      },
    );
  }

  editClick() {
    this.bottomSheetService.openBottomSheet(DailyFintechRecommendationEditComponent, {
      cellNumber: this.cellNumber,
    });
    const sub = this.bottomSheetService.onClose.subscribe(() => {
      if (this.bottomSheetService.outputData()?.submit) {
        this.recommendationApiService
          .updateStoredBill(this.type, {
            alias: this.bottomSheetService.outputData()?.alias,
            id: this.cellNumber.id,
            pinned: this.cellNumber.pinned,
          })
          .subscribe(
            (response) => {
              this.messageService.showSuccessMessage(response.result.message);
              this.cellNumberItemBottomSheetService.reload();
              sub.unsubscribe();
            },
            (e) => {
              this.showErrorIfExists(e);
            },
          );
      }
    });
  }

  private close() {
    this.bottomSheetService.closeBottomSheet();
  }

  showErrorIfExists(e: any) {
    this.messageService.showErrorOfErrorResponse(e);
  }
}
