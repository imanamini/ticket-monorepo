import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterDamageStateManagementService } from '../../services/register-damage-state-management.service';
import { UiUploadBoxComponent } from '../../../../../../components/ui-upload-box/ui-upload-box.component';
import { DamagesDocumentModel } from '../../../../../equipment/api/models/damages/damages-document.model';
import { DamageDocuments } from '../../../../../equipment/api/models/damages/damages.model';
import { HttpEventType } from '@angular/common/http';
import { ClaimSendFileService } from '../../../../../equipment/api/services/claim/claim-send-file.service';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { Router } from '@angular/router';
import { ClaimApiService } from '../../../../../../data-access/services/claim/claim-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'register-damage-step-three',
  templateUrl: './register-damage-step-three.component.html',
  standalone: true,
  imports: [
    UiUploadBoxComponent,
    ActionButtonsComponent
  ],
  styleUrls: ['./register-damage-step-three.component.scss']
})
export class RegisterDamageStepThreeComponent extends BaseComponent implements OnInit, OnDestroy {

  shouldBeUploadDocumentList: DamagesDocumentModel[];

  damageDocuments: DamageDocuments[] = [];

  percent = 0;

  constructor(
    private claimSendFileService: ClaimSendFileService,
    private stateManagement: RegisterDamageStateManagementService,
    private claimApiService: ClaimApiService,
    private messageService: MessageService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDamageDocuments();
  }

  selectedFile(file: File, upItem: DamagesDocumentModel): void {
    const fd = new FormData();
    fd.append('File', file);
    fd.append('TypeIdentifier', upItem.identifier);
    upItem.uploadType = 'uploading';
    this.claimSendFileService.uploadDocument(fd).subscribe(event => {

      if (event.type === HttpEventType.UploadProgress) {
        this.percent = Math.round(event.loaded / event.total * 100);
      } else if (event.type === HttpEventType.Response) {
        upItem.uploadType = 'success';
        this.damageDocuments.push({
          url: event.body.data.url,
          typeIdentifier: upItem.identifier
        });
        this.stateManagement.updateDocuments(this.damageDocuments);
        if (this.damageDocuments.length === 5) {
        }
      }
    }, err => {
      upItem.uploadType = 'failed';
    });
  }

  onSave(): void {
    const subscription = this.claimApiService.addClaim(this.stateManagement.getAllInfo()).subscribe(res => {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/step-four`], {
        queryParams: {}, queryParamsHandling: 'merge',
      }).then();
      this.stateManagement.setClaimCaseNo(res.data.claimCaseNo);
    }, error => {
      this.messageService.showErrorIfExists(error);
    });
    this.addSubscription(subscription);
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }

  getDamageDocuments(): void {
    setTimeout(() => {
      this.claimApiService.getDocumentTypeList().subscribe(res => {
        this.shouldBeUploadDocumentList = this.setData(res.data);
      });
    }, 500);
  }

  setData(res: DamagesDocumentModel[]): DamagesDocumentModel[] {
    res.map(UploadList => {
      UploadList.uploadType = 'initial';
    });
    return res;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
