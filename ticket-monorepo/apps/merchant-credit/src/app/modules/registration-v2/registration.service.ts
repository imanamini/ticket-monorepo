import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GetTicketDetailResponse } from '../../api/clients/registration/response-models/get-ticket-detail.response';
import { RegistrationPages, RegistrationStateToPageMap } from './models/registration-pages';
import { ActivatedRoute, Router } from '@angular/router';
import { Rule } from '../../api/models/registration/rules/rules.response';
import { Step } from '../../api/clients/registration/basic-models/step';
import { MERCHANT_TYPE } from '../../api/clients/registration/basic-models/merchant.type';
import {
  DocumentItem,
  MaxLimitPerDocuments,
  middleEastProviderDocuments,
  MiddleEastRegularPersonLimits
} from '../../api/models/registration/pages/limitation/limitation.model';
import { RegistrationApiService } from '../../api/clients/registration/registration-api.service';
import { GetStepsResponse, StepsHeader } from '../../api/clients/registration/response-models/get-steps.response';
import {
  FLOW_STATUS, MIDDLE_EAST_FLOW_STATUS_TO_STATE_CONFIG,
  MIDDLE_EAST_STEP_TO_STATE_MAP, RegistrationState
} from '../../api/models/registration/states';
import { PaymentDetailItem } from '../../api/models/registration/payment/payment-detail';
import { environment } from '../../../environments/environment';
import { PersonInfo } from './models/person-info';
import { SetUserDetailsRequest } from '../../api/models/registration/set-user-details.request';
import { VerifyOtpResponse } from '../../api/models/otp/verify-otp.response';
import { SignatureConfigResponse } from '../../api/models/signature/signature-config.response';
import { SignatureGenerateResponse } from '../../api/models/signature/signature-generate.response';
import { SignatureDetailsResponse } from '../../api/models/signature/signature-details.response';
import { SignableDocumentConfigResponse } from '../../api/models/signable-doc/signable-document-config.response';
import { SignableDocument } from '../../api/models/signable-doc/signable-documents.response';
import { UploadableFile } from '../../api/models/upload/uploadable-file';
import { BaseApiResponse } from '../../api/models/base-api.response';
import { MessageService } from '../../core/message.service';
import { TicketService } from '../../core/ticket.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RegistrationService {

  ticket: BehaviorSubject<string> = new BehaviorSubject('');

  passwordStatus: BehaviorSubject<string> = new BehaviorSubject('');

  creditId: string = '';

  steps: BehaviorSubject<Step[]> = new BehaviorSubject<Step[]>([]);

  stepsHeader: BehaviorSubject<StepsHeader | null> = new BehaviorSubject<StepsHeader | null>(null);

  currentStep: BehaviorSubject<string> = new BehaviorSubject('');

  flowStatus = new BehaviorSubject(FLOW_STATUS.ACTIVE);

  stateIndex: BehaviorSubject<number> = new BehaviorSubject(0);

  currentPage: RegistrationPages = RegistrationPages.OVERVIEW;

  rules: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>([]);

  personInfo: BehaviorSubject<PersonInfo> = new BehaviorSubject({});

  constructor(
    private api: RegistrationApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private ticketService: TicketService
  ) {
  }

  refreshTicketDetails(): Observable<GetTicketDetailResponse> {
    return this.ticketService.refreshTicketDetails(this.creditId);
  }

  getTicketDetail(forceUpdate: boolean = false): Observable<GetTicketDetailResponse> {
    return this.ticketService.getTicketDetail(this.creditId, forceUpdate);
  }

  setPage(page: RegistrationPages): void {
    this.currentPage = page;
  }

  nextPage(): void {
    switch (this.currentPage) {
      case RegistrationPages.OVERVIEW:
        const page = this.findStepPage();
        if (page) {
          const pageNumber = +page as RegistrationPages;
          switch (pageNumber) {
            case RegistrationPages.DOCUMENT_SELECTION:
              this.redirect('step/documents');
              break;
            case RegistrationPages.SCORE_CALCULATION:
              this.redirect('step/score');
              break;
            case RegistrationPages.FEE_PAYMENT:
              this.redirect('step/fee');
              break;
            case RegistrationPages.IDENTIFICATION:
              this.redirect('step/identification');
              break;
            case RegistrationPages.DIGITAL_SIGNATURE:
              this.redirect('step/signature');
              break;
            case RegistrationPages.ACCOUNT_OPENING:
              this.redirect('step/bank-account');
              break;
            case RegistrationPages.SIGNING:
              this.redirect('step/sign');
              break;
          }
        }
        break;
    }
  }

  goToOverviewPage(): void {
    this.redirect('overview');
  }

  redirect(relativePath: string): void {
    this.router.navigate([relativePath], {
      relativeTo: this.route
    });
  }

  private findStepPage(): string | null {
    const stateIndex = this.stateIndex.getValue();
    let destinationPage = null;
    Object.keys(RegistrationStateToPageMap).forEach(pageIndex => {
      if (RegistrationStateToPageMap[pageIndex].indexOf(stateIndex) >= 0) {
        destinationPage = pageIndex;
      }
    });
    return destinationPage;
  }

  getAndSetStepsData() {
    from(this.getStepsFromApi()).pipe(
      tap(res => {
        this.steps.next(res.steps);
        this.stepsHeader.next(res.header);

        const current = this.findCurrentStepUsingStateNumber(res.currentStep);
        this.stateIndex.next(res.currentStep);
        if (current) {
          this.currentStep.next(current);
        }
        this.flowStatus.next(this.findCurrentFlowStatus(res.currentStep));
      }),
      catchError(e => {
        this.messageService.showErrorIfExists(e);
        throw e;
      })
    ).subscribe();
  }

  getStepsFromApi(): Observable<GetStepsResponse> {
    const creditId = this.creditId;
    return this.api.getSteps(creditId);
  }

  private findCurrentStepUsingStateNumber(state: RegistrationState) {
    let step = null;
    Object.keys(MIDDLE_EAST_STEP_TO_STATE_MAP).forEach(stepKey => {
      if (MIDDLE_EAST_STEP_TO_STATE_MAP[stepKey].indexOf(state) >= 0) {
        step = stepKey;
      }
    });
    return step;
  }

  private findCurrentFlowStatus(state: RegistrationState): FLOW_STATUS {
    let flowStatus = FLOW_STATUS.ACTIVE;
    MIDDLE_EAST_FLOW_STATUS_TO_STATE_CONFIG.forEach(item => {
      if (item.states.indexOf(state) >= 0) {
        flowStatus = item.flowStatus;
      }
    });
    return flowStatus;
  }

  getAmountLimitations(type: MERCHANT_TYPE): MaxLimitPerDocuments[] {
    return MiddleEastRegularPersonLimits;
  }

  getRequiredDocumentsList(type: MERCHANT_TYPE): DocumentItem[] {
    // return type === MERCHANT_TYPE.INDIVIDUAL ? middleEastProviderDocuments : documentsLegal;
    return middleEastProviderDocuments;
  }

  calculateAmountBasedOnSelectedDocuments(type: MERCHANT_TYPE, documentIds: string[]) {
    let maxAmount = 0;
    const data = this.getAmountLimitations(type);
    data.forEach(item => {
      if (item.documents.every(docId => documentIds.indexOf(docId) !== -1) && item.maxAmount > maxAmount) {
        maxAmount = item.maxAmount;
      }
    });
    return maxAmount;
  }

  setMaxAmount(amount: number, registerCellNumber: string): Observable<BaseApiResponse> {
    const creditId = this.creditId;
    return this.api.middleEastReviseMaxAmount(creditId, amount, registerCellNumber);
  }

  getPaymentDetails(): Observable<{ details: PaymentDetailItem[], totalAmount: number, description: string }> {
    const creditId = this.creditId;
    return this.api.getPaymentDetails(creditId);
  }

  initializeFeePayment(): Observable<{ trackingCode: string }> {
    const creditId = this.creditId;
    return this.api.initializePayment(creditId);
  }

  redirectToGateway(trackingCode: string): void {
    const creditId = this.creditId;
    const callback = environment.feeCallbackUrl.replace('{CREDIT}', creditId);

    this.api.getTicketForPayment(trackingCode, callback).pipe(
      catchError(error => {
        console.error(error);
        return of(null);
      })
    ).subscribe(res => {
      if (res && res.payUrl) {
        window.location.href = res.payUrl;
      }
    });
  }

  updatePersonInfo(info: PersonInfo): void {
    let val = this.personInfo.getValue();
    val = Object.assign({}, val, info);
    this.personInfo.next(val);
  }

  initializeIdentityEvaluation(birthdate: string): Promise<any> {
    const creditId = this.creditId;
    return this.api.initializeIdentityEvaluation(creditId, birthdate).toPromise();
  }

  resendOtp(): Promise<any> {
    const creditId = this.creditId;
    return this.api.resendOtp(creditId).toPromise();
  }

  verifyOtp(code: string): Observable<VerifyOtpResponse> {
    const creditId = this.creditId;
    return this.api.verifyOtp(creditId, code);
  }

  setUserBasicInfo(details: SetUserDetailsRequest): Observable<BaseApiResponse> {
    const creditId = this.creditId;
    return this.api.setBasicDetails(creditId, details);
  }

  setAddress(body: { address: string, cityCode: string, provinceCode: string }) {
    const creditId = this.creditId;
    return this.api.setAddress(creditId, body).toPromise();
  }

  getSignatureConfig(): Observable<SignatureConfigResponse> {
    const creditId = this.creditId;
    return this.api.getSignatureConfig(creditId);
  }

  initializeDigitalSignature(): Observable<{ trackingCode: string }> {
    const creditId = this.creditId;
    return this.api.initDigitalSignature(creditId);
  }

  getRedirectToSignatureProvider(trackingCode: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!trackingCode) {
        reject('کد رهگیری صحیح نیست');
      }

      const creditId = this.creditId;
      const callbackUrl = environment.signatureCallbackUrl.replace('{CREDIT}', creditId);

      this.api.getUrlForCreatingSignature(trackingCode, callbackUrl).subscribe(res => {
        resolve(res.redirectUrl);
      }, e => {
        reject(e);
      });
    });
  }

  generateSignature(): Observable<SignatureGenerateResponse> {
    const creditId = this.creditId;
    return this.api.generateSignature(creditId);
  }

  generateSignatureForNewUsers(password: string): Observable<SignatureGenerateResponse> {
    const creditId = this.creditId;
    return this.api.generateSignatureForNewUsers(creditId, password);
  }

  getSignatureDetailsForNewUsers(): Observable<SignatureDetailsResponse> {
    const creditId = this.creditId;
    return this.api.getSignatureDetailsForNewUsers(creditId);
  }

  getConfigOfSignableDocuments(): Promise<{
    config: SignableDocumentConfigResponse,
    documents: SignableDocument[],
  }> {
    const creditId = this.creditId;
    return new Promise<any>((resolve, reject) => {
      this.api.getSignableDocumentsConfig(creditId).subscribe(config => {
        this.api.getSignableDocuments(creditId).subscribe(documents => {
          resolve({
            documents: documents.documents,
            config
          });
        }, e => {
          reject();
        });
      }, e => {
        reject();
      });
    });
  }

  generateSignableDocuments(): Observable<any> {
    const creditId = this.creditId;
    return this.api.generateSignableDocuments(creditId);
  }

  getListOfDocumentsForUploading(): Promise<{ files: UploadableFile[] }> {
    const creditId = this.creditId;
    return new Promise((resolve, reject) => {
      this.api.getListOfDocumentsForUploading(creditId).subscribe(res => {
        resolve({
          files: res.detailsModels
        });
      }, e => {
        reject();
      });
    });
  }

  uploadDocument(fileId: string, file: File): Observable<BaseApiResponse> {
    const creditId = this.creditId;
    return this.api.uploadDocument(creditId, fileId, file);
  }

  approveDocuments(): Observable<any> {
    const creditId = this.creditId;
    return this.api.approveDocuments(creditId);
  }

  submitUserInformation(): Observable<any> {
    const creditId = this.creditId;
    return this.api.submitInformation(creditId);
  }

  getFile(fileId: string): Observable<Blob> {
    return this.api.getDocumentFile(fileId);
  }

  signDocument(trackingCode: string): Observable<BaseApiResponse> {
    const creditId = this.creditId;
    return this.api.signDocument(creditId, trackingCode);
  }

  signDocumentForNewUser(trackingCode: string, password: string): Observable<BaseApiResponse> {
    const creditId = this.creditId;
    return this.api.signDocumentForNewUser(creditId, trackingCode, password);
  }
}
