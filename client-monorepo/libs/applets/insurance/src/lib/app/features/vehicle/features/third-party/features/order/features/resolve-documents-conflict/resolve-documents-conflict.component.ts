import { Component, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { NgStyle } from '@angular/common';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { UploadDocumentsListComponent } from '../../components/upload-documents-list/upload-documents-list.component';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { DocumentApiService } from '../../../../../../data-access/services/third-party/document-api.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuranceTabEnum } from '../../../../../../../policy/data-access/enums/policy-list.enum';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'resolve-documents-conflict',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ThirdPartyStepperComponent,
    UiLoadingSpinnerComponent,
    UploadDocumentsListComponent,
    NgStyle
  ],
  templateUrl: './resolve-documents-conflict.component.html',
  styleUrl: './resolve-documents-conflict.component.scss'
})
export class ResolveDocumentsConflictComponent extends BaseComponent {
  constructor() {
    super();
  }

  private thirdPartySharedService = inject(VehicleSharedService);
  private documentApiService = inject(DocumentApiService);
  private closeService = inject(CloseService);
  public storeService = inject(StoreService);

  isLoaded = signal<boolean>(false);
  updateDocumentsValidations: Subject<boolean> = new Subject();
  areMandatoryDocumentsUploaded = signal<boolean>(false);

  handleActiveButtonClicked(): void {
    this.updateDocumentsValidations.next(true);
    if (this.areMandatoryDocumentsUploaded()) {
      this.documentApiService.checkOrderDocumentsBeingUploaded(this.storeService.getFormId(), true).subscribe({
        next: response => {
          if (response.result) {
            this.thirdPartySharedService.navigate(InsuranceUrlsEnum.PolicyDetail,
              {
                queryParams: {[InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY},
                baseUrl: false,
                queryParamsHandling: 'merge',
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
    this.thirdPartySharedService.navigate(ThirdPartyUrlsEnum.UserInfo, null, InsuranceProductTypeEnum.ThirdParty);
  }

  onDocumentsListInitialized(): void {
    this.isLoaded.set(true);
  }

  handleCloseClicked(): void {
    this.closeService.close();
  }
}
