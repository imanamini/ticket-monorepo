import { Component, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MERCHANT_TYPE } from '../../../../../api/clients/registration/basic-models/merchant.type';
import { RegistrationService } from '../../../registration.service';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';
import { MessageService } from '../../../../../core/message.service';
import { TermsConditionComponent } from './amount-confirmation/terms-condition/terms-condition.component';

@Component({
  selector: 'step-documents',
  templateUrl: './step-documents.component.html',
  styleUrls: ['./step-documents.component.scss']
})
export class StepDocumentsComponent implements OnInit {

  form!: FormGroup;

  userType: MERCHANT_TYPE = MERCHANT_TYPE.INDIVIDUAL;

  merchantTypes = MERCHANT_TYPE;

  documents: DocumentItem[] = [];

  requiredDoc: DocumentItem | undefined;

  selectedDocumentIds: string[] = [];

  amount = 0;

  pendingAction = false;

  details: any;

  agreed = false;

  constructor(
    private smartDialog: SmartDialog,
    private service: RegistrationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getStep();
    const documents = this.service.getRequiredDocumentsList(this.userType);
    this.requiredDoc = documents.find(doc => doc.id === '1');
    this.documents = documents.filter(doc => doc.id !== '1');
    if (this.requiredDoc) {
      this.selectedDocumentIds.push(this.requiredDoc.id);
    }
    this.calculateAmount();
    this.createForm();
  }

  helpMe(): void {

  }

  getStep() {
    this.service.getStepsFromApi().pipe(
      switchMap(res => {
        this.details = res.steps[0].detail;
        return [];
      })
    ).subscribe();
  }

  createForm() {
    this.form = this.formBuilder.group({
      registerCellNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0][9][0-9][0-9]{8,8}$/)
      ]),
    });
  }

  proceed(): void {
    this.pendingAction = true;
    this.service.setMaxAmount(this.amount, this.form.controls['registerCellNumber'].value).pipe(
      switchMap(res => {
        this.service.goToOverviewPage();
        return of(null);
      }),
      catchError(e => {
        this.pendingAction = false;
        this.messageService.showErrorIfExists(e);
        return of(null);
      })
    ).subscribe();
  }

  onDocumentClick(docId: string): void {
    if (this.selectedDocumentIds.indexOf(docId) < 0) {
      this.selectedDocumentIds.push(docId);
    } else {
      this.selectedDocumentIds = this.selectedDocumentIds.filter(id => id !== docId);
    }
    this.calculateAmount();
  }

  private calculateAmount() {
    this.amount = this.service.calculateAmountBasedOnSelectedDocuments(this.userType, this.selectedDocumentIds);
  }

  showTac() {
    this.smartDialog.open(TermsConditionComponent);
  }

}
