import { Component, inject, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Subject } from 'rxjs';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import { UploadDocumentsListComponent } from '../../components/upload-documents-list/upload-documents-list.component';
import { DocumentApiService } from '../../../../../../data-access/services/third-party/document-api.service';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { VehicleErrorCode } from '../../../../../../data-access/enums/vehicle-error-code.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { StoreService } from '../../../../data-access/services/store.service';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'upload-document',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ThirdPartyStepperComponent,
    UiLoadingSpinnerComponent,
    UploadDocumentsListComponent,
    NgStyle
  ],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent extends BaseComponent {
  private sharedService = inject(VehicleSharedService);
  private documentApiService = inject(DocumentApiService);
  private closeService = inject(CloseService);
  public storeService = inject(StoreService);

  isLoaded = signal<boolean>(false);
  updateDocumentsValidations: Subject<boolean> = new Subject();

  areMandatoryDocumentsUploaded = signal<boolean>(false);

  constructor() {
    super();
  }

  handleActiveButtonClicked(): void {
    this.updateDocumentsValidations.next(true);
    if (this.areMandatoryDocumentsUploaded()) {
      this.documentApiService.checkOrderDocumentsBeingUploaded(this.storeService.getFormId(), false).subscribe({
        next: response => {
          if (response.result) {
            this.sharedService.navigate(ThirdPartyUrlsEnum.Address, null, InsuranceProductTypeEnum.ThirdParty);
          }
        },
        error: (err) => {
          if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
            this.sharedService.navigate(ThirdPartyUrlsEnum.State, {
              queryParamsHandling: 'merge'
            }, InsuranceProductTypeEnum.ThirdParty);
          }
        }
      });
    }
  }

  onMandatoryDocumentsUploaded(status: boolean): void {
    this.areMandatoryDocumentsUploaded.set(status);
  }

  handleDeActiveButtonClicked(): void {
    this.sharedService.navigate(ThirdPartyUrlsEnum.UserInfo, null, InsuranceProductTypeEnum.ThirdParty);
  }

  onDocumentsListInitialized(): void {
    this.isLoaded.set(true);
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheckQueryParam();
  }
}
