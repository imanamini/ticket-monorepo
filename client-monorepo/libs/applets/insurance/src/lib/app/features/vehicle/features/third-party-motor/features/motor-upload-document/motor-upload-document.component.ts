import { Component, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Subject } from 'rxjs';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { VehicleErrorCode } from '../../../../data-access/enums/vehicle-error-code.enum';
import { MotorUploadDocumentsListComponent } from './motor-upload-documents-list/motor-upload-documents-list.component';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';

@Component({
  selector: 'motor-upload-document',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    UiLoadingSpinnerComponent,
    MotorUploadDocumentsListComponent,
    NgStyle,
    ActionButtonsComponent,
    UiLoadingSpinnerComponent
  ],
  templateUrl: './motor-upload-document.component.html',
  styleUrl: './motor-upload-document.component.scss'
})
export class MotorUploadDocumentComponent extends ThirdPartyMotorDirective {
  isLoaded = signal<boolean>(false);
  updateDocumentsValidations: Subject<boolean> = new Subject();

  areMandatoryDocumentsUploaded = signal<boolean>(false);

  handleActiveButtonClicked(): void {
    this.updateDocumentsValidations.next(true);
    if (this.areMandatoryDocumentsUploaded()) {
      this.motorApiService.checkOrderDocumentsBeingUploaded(this.storeService.getFormId(), false).subscribe({
        next: response => {
          if (response.result) {
            this.onNext(THIRD_PARTY_MOTOR_ROUTE.UserAddress);
          }
        },
        error: (err) => {
          if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
            this.onNext(THIRD_PARTY_MOTOR_ROUTE.OrderState);
          }
        }
      });
    }
  }

  onMandatoryDocumentsUploaded(status: boolean): void {
    this.areMandatoryDocumentsUploaded.set(status);
  }

  handleDeActiveButtonClicked(): void {
    this.onNext(THIRD_PARTY_MOTOR_ROUTE.UserInfo);
  }

  onDocumentsListInitialized(): void {
    this.isLoaded.set(true);
  }

  protected onClose(): void {
    this.closeService.closeWithCheckQueryParam();
  }

  protected onNext(route: string): void {
    this.router.navigate([route], {
      relativeTo: this.route.parent,
      queryParamsHandling: 'merge'
    }).then();
  }
}
