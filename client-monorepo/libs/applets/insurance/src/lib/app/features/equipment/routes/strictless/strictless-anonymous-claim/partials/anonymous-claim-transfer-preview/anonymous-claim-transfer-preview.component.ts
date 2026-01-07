import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ChangePolicyOwnerComponent } from '../change-policy-owner/change-policy-owner.component';
import { ScreenSizeEnum } from '../../../../../enums/screen-size.enum';
import { LayoutService } from '../../../../../../../data-access/services/layout.service';
import { ConfigAppService } from '../../../../../../../data-access/services/config-app.service';
import { PersianTime } from '../../../../../../../util/persian-time';
import { PersianTimeModel } from '../../../../../models/persian-date.model';
import { HorizontalStepModel } from '../../../../../../../components/horizontal-tab/models/horizontal-tab.model';
import { NgIf } from '@angular/common';
import { HorizontalTabComponent } from '../../../../../../../components/horizontal-tab/horizontal-tab.component';
import { CardComponent } from '../../../../../../../components/card/card.component';
import { PolicyGeneralInfoComponent } from '../../../../../applets/policy-general-info/policy-general-info.component';
import {
  UiStatusChipsComponent
} from '../../../../../../../components/ui-status-chip/ui-status-chips/ui-status-chips.component';
import { UiDetailListComponent } from '../../../../../../../components/ui-detail-list/ui-detail-list.component';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';
import { PolicyTransferResponseModel } from '../../../../../api/models/policy/policy-transfer-response.model';

@Component({
  selector: 'anonymous-claim-transfer-preview',
  templateUrl: './anonymous-claim-transfer-preview.component.html',
  styleUrls: ['./anonymous-claim-transfer-preview.component.scss'],
  imports: [
    NgIf,
    HorizontalTabComponent,
    CardComponent,
    PolicyGeneralInfoComponent,
    UiStatusChipsComponent,
    UiDetailListComponent,
    UiButtonComponent
  ],
  standalone: true
})
export class AnonymousClaimTransferPreviewComponent implements OnInit {

  @Input()
  transferData: PolicyTransferResponseModel;

  policyInformationList: { title: string, value: string }[] = [];

  screenSize: ScreenSizeEnum;

  currentTab: 0 | 1 = 0;

  tabs: HorizontalStepModel[] = [
    {index: 0, title: 'اطلاعات بیمه‌نامه'},
    {index: 1, title: 'اعلام خسارت'}
  ];

  policyStatusMapper = {};

  constructor(
    private layout: LayoutService,
    private dialog: MatDialog,
    private sheet: MatBottomSheet,
    private configAppService: ConfigAppService
  ) {
  }

  ngOnInit(): void {
    this.layout.screenSizeChanged.subscribe(size => {
      this.screenSize = size;
    });
    this.policyStatusMapper = this.configAppService.policyStatesMapper.getValue();
    this.createList();
  }

  createList(): void {
    this.policyInformationList.length = 0;
    const createAt = this.transferData.policy.issuedAt ?
      new PersianTime(this.transferData.policy.issuedAt).convert(PersianTimeModel.YYYY_MD_HM) : '--';
    const startAt = this.transferData.policy.startAt ?
      new PersianTime(this.transferData.policy.startAt).convert(PersianTimeModel.YYYY_MD_HM) : '--';
    const endAt = this.transferData.policy.endAt ?
      new PersianTime(this.transferData.policy.endAt).convert(PersianTimeModel.YYYY_MD_HM) : '--';

    this.policyInformationList.push({title: 'نوع', value: this.ifExist(this.transferData.policy.policyType.title)});
    this.policyInformationList.push({
      title: 'شماره بیمه نامه',
      value: this.ifExist(this.transferData.policy.policyDraftNo)
    });
    this.policyInformationList.push({
      title: 'نام بیمه‌گزار',
      value: this.ifExist(this.transferData.policy.buyer.fullName)
    });
    this.policyInformationList.push({title: 'تاریخ خرید', value: createAt});
    this.policyInformationList.push({title: 'تاریخ شروع', value: startAt});
    this.policyInformationList.push({title: 'تاریخ اعتبار', value: endAt});
  }

  ifExist(value): string {
    return value ? value : ' -- ';
  }

  changeOwner(): void {
    if (this.screenSize === 'LG') {
      this.dialog.open(ChangePolicyOwnerComponent, {
        data: {policy: this.transferData.policy, hasProfile: this.transferData.hasProfile},
        width: '450px'
      });
    } else {
      this.sheet.open(ChangePolicyOwnerComponent, {
        data: {policy: this.transferData.policy, hasProfile: this.transferData.hasProfile},
      });
    }
  }
}
