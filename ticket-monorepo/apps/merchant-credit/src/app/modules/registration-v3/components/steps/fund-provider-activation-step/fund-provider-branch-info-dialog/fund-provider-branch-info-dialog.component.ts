import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { RegistrationV3Service } from '../../../../services/registration-v3.service';
import { MERCHANT_TYPE } from '../../../../../../api/clients/registration/basic-models/merchant.type';

@Component({
  selector: 'fund-provider-branch-info-dialog',
  templateUrl: './fund-provider-branch-info-dialog.component.html',
  styleUrls: ['./fund-provider-branch-info-dialog.component.scss']
})
export class FundProviderBranchInfoDialogComponent implements OnInit {
  type: MERCHANT_TYPE = 0;
  BorderColorsEnum = BorderColorsEnum;

  docItems: string[] = [];

  constructor(private smartDialog: SmartDialog,
              private registrationV3Service: RegistrationV3Service) {
    this.type = this.smartDialog.data.type;

  }

  ngOnInit(): void {
    this.getDocumentData();
  }

  onClose() {
    this.smartDialog.close();
  }

  getDocumentData() {
    const samanDocument = this.registrationV3Service.getSamanDocumentsForBranches(this.type);
    const maxCreditAmountString = localStorage.getItem('maxCreditAmount');
    const maxCreditAmount = maxCreditAmountString !== null ? Number(maxCreditAmountString) : null;

    this.docItems = samanDocument
      .filter(item => item.maxCreditAmount === maxCreditAmount)
      .flatMap(item => item.items || []);
  }
}
