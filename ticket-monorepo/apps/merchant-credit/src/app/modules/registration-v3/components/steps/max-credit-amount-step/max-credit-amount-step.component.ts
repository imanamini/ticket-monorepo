import { Component, OnInit } from '@angular/core';
import { DocumentItems } from '../../../../../api/models/registration-v3/registration-v3.model';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';
import {
  MaxCreditAmountConfirmDialogComponent
} from './max-credit-amount-confirm-dialog/max-credit-amount-confirm-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepsBaseComponent } from '../steps-base/steps-base.component';
import { RegistrationApiService } from '../../../../../api/clients/registration/registration-api.service';
import { MessageService } from '../../../../../core/message.service';
import { RegistrationV3Service } from '../../../services/registration-v3.service';
import { numberToString } from '../../../../../utils/number-to-string';
import { ICS_STATES, StepResultConfig } from '../../../../../api/models/registration-v3/step-result-config';
import { StepConfigAction } from '../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { ShowError } from '@digipay/ui-form-field-builder';

@Component({
  selector: 'app-max-credit-amount-step',
  templateUrl: './max-credit-amount-step.component.html',
  styleUrls: ['./max-credit-amount-step.component.scss']
})
export class MaxCreditAmountStepComponent extends StepsBaseComponent implements OnInit {
  selectedDoc: number = 0;
  stepSections: 'select-amount' | 'select-docs' | 'select-account' = 'select-amount';
  documents!: DocumentItems;
  form!: FormGroup;
  isValid: boolean = false;
  isBack: boolean = false;
  showError: ShowError = 'hidden';
  maxCreditAmount: any;
  errorData: any;
  ICS_STATES = ICS_STATES;
  errorStatus!: ICS_STATES;

  constructor(
    private smartDialog: SmartDialog,
    private formBuilder: FormBuilder,
    private registrationApiService: RegistrationApiService,
    private registrationV3Service: RegistrationV3Service,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    // this.selectedDoc = this.steps[0]?.maxCreditAmountDetails[0].maxCreditAmount;
    this.errorStatus = this.details?.registration?.currentState;
    const action: StepConfigAction = StepResultConfig[this.errorStatus];
    this.errorData = action;
  }

  createForm() {
    this.form = this.formBuilder.group({
      iban: new FormControl('', [
        Validators.required,
        Validators.pattern(/(IR)\d{2}0560(?!6118)\d{18}/)
      ]),
    });

    this.form.valueChanges.subscribe(value => {
      this.isValid = this.form.valid;
      const ibanLength = 26;
      if (value.iban.length >= ibanLength) {
        this.showError = 'show';
      } else {
        this.showError = 'hidden';
      }
    });
  }

  onClick(doc: any): void {
    this.selectedDoc = doc.maxCreditAmount;
    localStorage.removeItem('maxCreditAmount');
    localStorage.setItem('maxCreditAmount', doc.maxCreditAmount);
    this.isValid = true;
  }

  onSubmit() {
    switch (this.stepSections) {
      case 'select-amount':
        this.stepSections = 'select-docs';
        this.getDocumentData();
        this.isBack = true;
        break;
      case 'select-docs':
        this.smartDialog.open(MaxCreditAmountConfirmDialogComponent, {
          selectedDoc: this.selectedDoc
        }).then(data => {
          if (data && data.confirmed) {
            this.stepSections = 'select-account';
            this.isValid = false;
            this.isBack = false;
          }
        });
        break;
      case 'select-account':
        this.registrationApiService.reviseMaxAmount(this.creditId, this.selectedDoc, this.form.controls.iban.value).subscribe(() => {
          this.reloadDataEvent.emit(true);
        }, error => {
          this.messageService.showErrorIfExists(error);
        });
        break;
    }
  }

  onBack() {
    if (this.stepSections == 'select-docs') {
      this.stepSections = 'select-amount';
      this.isBack = false;
    }

  }

  getDocumentData() {
    const samanDocument = this.registrationV3Service.getSamanDocuments(this.type);
    samanDocument.forEach(doc => {
      if (doc.maxCreditAmount === this.selectedDoc) {
        this.documents = doc;
        this.maxCreditAmount = numberToString(this.documents?.maxCreditAmount);
      }
    });
  }

  splitAndDisplay(value: any, pattern: any, defaultChar: any) {
    let i = 0;
    const v = value.toString();
    return pattern.replace(/#/g, () => v[i++] || defaultChar);
  }

  closeClick(id: string) {
    if (id === 'primary') {
      window.history.back();
    }
  }
}
