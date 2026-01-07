import { Component, inject, model, OnInit, signal } from '@angular/core';
import { DocumentItems } from '../../../../../../../../../api/models/registration-v3/registration-v3.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShowError } from '@digipay/ui-form-field-builder';
import { SmartDialog } from '../../../../../../../../../user-interface/services/smart-dialog';
import { RegistrationApiService } from '../../../../../../../../../api/clients/registration/registration-api.service';
import { MessageService } from '../../../../../../../../../core/message.service';
import {
  StepConfigAction
} from '../../../../../../../../../api/clients/registration-v3/basic-models/step-result-config.model';
import { numberToString } from '../../../../../../../../../utils/number-to-string';
import { EsLoanSamanBaseStepComponent } from '../es-loan-saman-base-step/es-loan-saman-base-step.component';
import { EsLoanSamanService } from '../../../services/es-loan-saman.service';
import {
  EsLoanTermsDialogComponent
} from '../../../../../../../../../sub-modules/es-loan-ui/es-loan-terms-dialog/es-loan-terms-dialog.component';
import {
  ES_LOAN_ICS_STATES, EsLoanStepResultConfig
} from '../../../../../../../../../api/clients/es-loan-registration/es-loan-step-result-config';
import { Router } from '@angular/router';

@Component({
  selector: 'es-loan-saman-max-credit-amount-step',
  templateUrl: './es-loan-saman-max-credit-amount-step.component.html',
  styleUrl: './es-loan-saman-max-credit-amount-step.component.scss'
})
export class EsLoanSamanMaxCreditAmountStepComponent extends EsLoanSamanBaseStepComponent implements OnInit {
  selectedDoc = signal<number>(0);
  stepSections = signal<'select-amount' | 'select-account'>('select-amount');
  documents = signal<DocumentItems>({} as DocumentItems);
  isValid = model<boolean>(false);
  isBack = model<boolean>(false);
  agreed = model<boolean>(false);
  showError = signal<ShowError>('hidden');
  maxCreditAmount = signal<string>('');
  errorData = signal<any>({} as any);
  errorStatus = signal<ES_LOAN_ICS_STATES>({} as ES_LOAN_ICS_STATES);
  BorderColorsEnum = signal<any>({} as any);

  form!: FormGroup;

  router = inject(Router);
  smartDialog = inject(SmartDialog);
  formBuilder = inject(FormBuilder);
  registrationApiService = inject(RegistrationApiService);
  esLoanSamanService = inject(EsLoanSamanService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.createForm();
    this.errorStatus.set(this.details()?.registration?.currentState);
    const action: StepConfigAction = EsLoanStepResultConfig[this.errorStatus()];
    this.errorData.set(action);
  }

  createForm() {
    this.form = this.formBuilder.group({
      iban: new FormControl('', [
        Validators.required,
        Validators.pattern(/(IR)\d{2}0560(?!6118)\d{18}/)
      ]),
    });

    this.form.valueChanges.subscribe(value => {
      this.isValid.set(this.form.valid);
      const ibanLength = 26;
      if (value.iban.length >= ibanLength) {
        this.showError.set('show');
      } else {
        this.showError.set('hidden');
      }
    });
  }

  onClick(doc: any): void {
    this.selectedDoc.set(doc.maxCreditAmount);
    localStorage.removeItem('maxCreditAmount');
    localStorage.setItem('maxCreditAmount', doc.maxCreditAmount);
    this.isValid.set(true);
  }

  onSubmit() {
    switch (this.stepSections()) {
      case 'select-amount':
        this.stepSections.set('select-account');
        this.getDocumentData();
        this.isBack.set(true);
        break;
      case 'select-account':
        this.registrationApiService.reviseMaxAmount(this.creditId(), this.selectedDoc(), this.form.controls.iban.value).subscribe(() => {
          this.reloadDataEvent.emit(true);
        }, error => {
          this.messageService.showErrorIfExists(error);
        });
        break;
    }
  }

  getDocumentData() {
    const samanDocument = this.esLoanSamanService.getSamanDocuments(this.type());
    samanDocument.forEach(doc => {
      if (doc.maxCreditAmount === this.selectedDoc()) {
        this.documents.set(doc);
        this.maxCreditAmount.set(numberToString(this.documents()?.maxCreditAmount));
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

  showTac() {
    this.smartDialog.open(EsLoanTermsDialogComponent);
  }

  openBankLink() {
    window.open('https://www.sb24.ir/e-services/e-banking/mobillet/open-account', '_blank');
  }

  agreeTerms(agree: boolean) {
    this.agreed.set(agree);
  }
}
