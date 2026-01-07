import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MERCHANT_TYPE } from '../../../../../api/clients/registration/basic-models/merchant.type';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { RegistrationService } from '../../../services/registration.service';
import { PageDialogComponent } from '../../../../../user-interface/ui-components/page-dialog/page-dialog.component';
import { Detail } from '../../../../../api/clients/registration/basic-models/step';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'app-credit-revise-select-documents-result',
  templateUrl: './credit-revise-select-documents-result.component.html',
  styleUrls: ['./credit-revise-select-documents-result.component.scss']
})
export class CreditReviseSelectDocumentsResultComponent implements OnInit, OnChanges {

  @Input()
  type: MERCHANT_TYPE = 0;

  @Input()
  detail!: Detail;

  @Input()
  maxAmount: number = 0;

  @Input()
  isFormValid: boolean = false;

  @Output()
  cancel = new EventEmitter();
  @Output()
  submit = new EventEmitter();
  @Output()
  back = new EventEmitter();

  requiredDocuments: DocumentItem[] = [];

  nextSteps: { [key: number]: string } = {
    [MERCHANT_TYPE.INDIVIDUAL]: 'درخواستِ شما پس از ثبت، وارد فرایند بررسی می‌شود. پس از طی موفقیت‌آمیزِ مراحلِ امکان‌سنجی و هویت‌سنجی، از شما برای افتتاحِ حضوری حساب دعوت می‌کنیم.',
    [MERCHANT_TYPE.LEGAL]: 'پس از ثبت درخواست، همکاران ما برای بررسی مدارک با شما تماس می‌گیرند و در صورت تایید، از همه صاحبین امضا، برای افتتاحِ حضوری حساب در شعبه بانک دعوت می‌کنیم.'
  };

  acceptedTac: boolean = false;

  constructor(
    private registrationService: RegistrationService,
    private smartDialog: SmartDialog,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.maxAmount) {
      this.requiredDocuments = this.registrationService.amountToDocuments(this.type, this.maxAmount);
    }
  }

  showTacDialog() {
    this.smartDialog.open(PageDialogComponent, {});
  }
}
