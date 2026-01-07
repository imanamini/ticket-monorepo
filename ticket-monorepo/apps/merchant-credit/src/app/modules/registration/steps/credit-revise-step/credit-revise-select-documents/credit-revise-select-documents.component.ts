import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  DocumentItem
} from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { RegistrationService } from '../../../services/registration.service';
import { MERCHANT_TYPE } from '../../../../../api/clients/registration/basic-models/merchant.type';

@Component({
  selector: 'app-credit-revise-select-documents',
  templateUrl: './credit-revise-select-documents.component.html',
  styleUrls: ['./credit-revise-select-documents.component.scss']
})
export class CreditReviseSelectDocumentsComponent implements OnChanges {

  @Input()
  registrationMaxAmount: number = 0;
  @Input()
  type: MERCHANT_TYPE = 0;

  @Output()
  changeMaxAmount = new EventEmitter<number>();

  merchantTypeEnum = MERCHANT_TYPE;
  selectableDocuments: DocumentItem[] = [];
  selectedDocuments: { [key: string]: boolean } = {};
  minimumDocuments: string[] = [];
  maxAmount = 0;

  constructor(
    private registrationService: RegistrationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type || changes.registrationMaxAmount) {
      this.initProcess();
    }
  }

  initProcess(): void {
    this.selectableDocuments = this.registrationService.amountToDocuments(this.type, this.registrationMaxAmount);
    this.selectedDocuments = {};
    this.minimumDocuments = this.registrationService.getMinimumDocIds(this.type);
    this.minimumDocuments.forEach(item => {
      this.selectedDocuments[item] = true;
    });
    this.calculateMaxAmount();
  }

  calculateMaxAmount(): void {
    const selectedDocIds = Object.keys(this.selectedDocuments).filter(docId => this.selectedDocuments[docId]);
    let maxAmount = this.registrationService.documentsToAmount(this.type, selectedDocIds);
    this.maxAmount = maxAmount > this.registrationMaxAmount ? this.registrationMaxAmount : maxAmount;
    this.changeMaxAmount.emit(this.maxAmount);
  }

}
