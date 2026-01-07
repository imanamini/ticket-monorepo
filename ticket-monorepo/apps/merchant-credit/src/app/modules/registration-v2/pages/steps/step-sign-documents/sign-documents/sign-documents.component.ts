import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../../registration.service';
import { SignableDocument } from '../../../../../../api/models/signable-doc/signable-documents.response';
import { MessageService } from '../../../../../../core/message.service';
import { RegistrationState } from '../../../../../../api/models/registration/states';
import { from, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

enum SignDocumentsAction {
  GENERATE_DOCS = 1,
  SIGN_DOCS = 2,
  SENT_CONTRACT_MSG = 3,
  SUCCESS_MSG = 4,
  REJECT_MSG = 5,
  PENDING = 6,
  GENERATION_FAILED_MSG = 8,
  GETTING_PASSWORD = 9,
  ERROR_MSG = 10
}

enum RegistrationChanges {
  REMOVE_NATIONAL_CARD_IMAGES = 1,
  DIGITAL_SIGNATURE_WITH_TICKET = 2,
  DIGITAL_SIGNATURE_WITH_PASSWORD = 5,
}

enum errorStatus {
  INVALID_PASSWORD = 1056,
  MERCHANT_CREDIT_DIGITAL_SIGNATURE_PASSWORD_EXPIRED = 15651,
  MERCHANT_CREDIT_DIGITAL_SIGNATURE_EXPIRED = 15652
}

@Component({
  selector: 'sign-documents',
  templateUrl: './sign-documents.component.html',
  styleUrls: ['./sign-documents.component.scss']
})
export class SignDocumentsComponent implements OnInit {

  documents: SignableDocument[] = [];

  gettingData = false;

  pdfFiles: { [id: string]: ArrayBuffer } = {};

  loadingFile: string = '';

  documentTitles: string[] = [];

  stepSubTitles: number[] = [];

  currentFileIndex = 0;

  personName = '';

  signatureImageId = '';

  openBankActionEnum = SignDocumentsAction;

  inProgressAction?: SignDocumentsAction;

  registrationChanges: number[] = [];

  stateToAction: { [key in RegistrationState]?: SignDocumentsAction } = {
    [RegistrationState.CONTRACT_GENERATION]: SignDocumentsAction.GENERATE_DOCS,
    [RegistrationState.CONTRACT_GENERATION_RESULT]: SignDocumentsAction.PENDING,
    [RegistrationState.CONTRACT_SIGNING]: SignDocumentsAction.SIGN_DOCS,
    [RegistrationState.OPEN_ACCOUNT_SUCCEED]: SignDocumentsAction.GENERATE_DOCS,
    [RegistrationState.DOCUMENT_GENERATION_FAILED]: SignDocumentsAction.GENERATION_FAILED_MSG,
    [RegistrationState.DOCUMENT_GENERATED]: SignDocumentsAction.SIGN_DOCS,
    [RegistrationState.DOCUMENT_SIGNED]: SignDocumentsAction.SENT_CONTRACT_MSG,
    [RegistrationState.CREDIT_LINE]: SignDocumentsAction.SENT_CONTRACT_MSG,
    [RegistrationState.CREDIT_LINE_UPLOAD_FILE]: SignDocumentsAction.SENT_CONTRACT_MSG,
    [RegistrationState.CREDIT_LINE_INQUIRY]: SignDocumentsAction.SENT_CONTRACT_MSG,
    [RegistrationState.CREDIT_LINE_INQUIRY_FAILED]: SignDocumentsAction.GENERATION_FAILED_MSG,
    [RegistrationState.COMPLETED_CREDIT_LINE]: SignDocumentsAction.SUCCESS_MSG,
    [RegistrationState.CREDIT_LINE_INQUIRY_REJECTED]: SignDocumentsAction.REJECT_MSG,
  };
  signing: boolean = false;

  // Getting passwords
  code = '';
  isPassProceed: boolean = false;
  document!: SignableDocument;
  errorMessage = '';
  inputDescription = '';
  errorData: any;
  cardTitle: string = 'تایید و امضای قرارداد';
  isBack: boolean = true;
  isClose: boolean = false;

  constructor(
    private service: RegistrationService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getState();
    this.service.getTicketDetail().subscribe(details => {
      if (details && details?.registration?.identityInfo?.name) {
        this.personName = details?.registration?.identityInfo?.name;
        this.registrationChanges = details?.registration?.registrationChanges;
        this.service.getSignatureDetailsForNewUsers().pipe(
          switchMap(res => {
            this.signatureImageId = res.signature?.signatureImageId;
            return [];
          })
        ).subscribe();
      }
    });
  }

  getState(withoutLoading = false): void {
    if (!withoutLoading) {
      this.inProgressAction = undefined;
    }

    from(this.service.getStepsFromApi()).pipe(
      tap(res => {
        const state = res.currentStep;
        if (this.stateToAction[state]) {
          this.dispatchAction(this.stateToAction[state]);
        } else {
          this.service.goToOverviewPage();
        }
      }),
      catchError(error => {
        console.error('Error fetching steps from API:', error);
        return [];
      })
    ).subscribe();
  }

  dispatchAction(action?: SignDocumentsAction): void {
    this.inProgressAction = action;
    switch (this.inProgressAction) {
      case SignDocumentsAction.PENDING:
        setTimeout(() => {
          this.getState(true);
        }, 5000);
        break;
      case SignDocumentsAction.GENERATE_DOCS:
        this.generateDocuments();
        break;
      case SignDocumentsAction.SIGN_DOCS:
        this.getDocuments();
        break;
      case SignDocumentsAction.SENT_CONTRACT_MSG:
        this.cardTitle = 'نتیجه بررسی قرارداد';
        this.isClose = true;
        this.isBack = false;
        break;
      case SignDocumentsAction.SUCCESS_MSG:
        this.cardTitle = 'نتیجه بررسی قرارداد';
        this.isClose = true;
        this.isBack = false;
        break;
      case SignDocumentsAction.REJECT_MSG:
        this.cardTitle = 'نتیجه بررسی قرارداد';
        this.isClose = true;
        this.isBack = false;
        break;
      case SignDocumentsAction.GENERATION_FAILED_MSG:
        this.cardTitle = 'نتیجه بررسی قرارداد';
        this.isClose = true;
        this.isBack = false;
        break;
    }

  }

  getDocuments(): void {
    this.gettingData = true;
    this.service.getConfigOfSignableDocuments().then(result => {
      const documents = result.documents;
      this.documents = documents;
      this.gettingData = false;
      this.getPdfFile(documents[0]);
      this.stepSubTitles = documents.map((doc) => {
        return doc.creationDate;
      });
      this.documentTitles = documents.map((doc, i) => {
        return doc.title || 'doc ' + i + 1;
      });
    });
  }

  private getPdfFile(doc: SignableDocument) {
    this.loadingFile = doc.trackingCode;

    from(this.service.getFile(doc.documentUrl)).pipe(
      switchMap(file => {
        return from(file.arrayBuffer()).pipe(
          tap(buffer => {
            this.pdfFiles[doc.trackingCode] = buffer;
          }),
          catchError(error => {
            console.error('Error converting file to array buffer:', error);
            return throwError(error);
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching file:', error);
        return throwError(error);
      }),
      tap(() => {
        this.loadingFile = '';
      })
    ).subscribe();
  }

  signDocument(document: SignableDocument): void {
    if (this.registrationChanges.includes(RegistrationChanges.DIGITAL_SIGNATURE_WITH_PASSWORD)) {
      this.document = document;
      this.inProgressAction = SignDocumentsAction.GETTING_PASSWORD;
      this.cardTitle = 'رمز امضای دیجیتال';
      this.isClose = true;
      this.isBack = false;
    } else {
      this.signing = true;
      from(this.service.signDocument(document.trackingCode)).pipe(
        tap(result => {
          if (this.documents[this.currentFileIndex + 1]) {
            this.currentFileIndex += 1;
          } else {
            // this.signingFinished();
            this.getState();
          }
          this.signing = false;
          this.cardTitle = 'نتیجه بررسی قرارداد';
          this.isClose = true;
          this.isBack = false;
        }),
        catchError(e => {
          this.messageService.showMessageOfResponse(e);
          this.signing = false;
          return of(null);
        })
      ).subscribe();
    }
  }

  passProceed() {
    this.signing = true;
    this.isPassProceed = false;
    from(this.service.signDocumentForNewUser(this.document.trackingCode, this.code)).pipe(
      tap(result => {
        if (this.documents[this.currentFileIndex + 1]) {
          this.currentFileIndex += 1;
        } else {
          // this.signingFinished();
          this.getState();
        }
        this.signing = false;
        this.isPassProceed = true;
      }),
      catchError(e => {
        this.isPassProceed = false;
        if (e.error.result.status === errorStatus.MERCHANT_CREDIT_DIGITAL_SIGNATURE_PASSWORD_EXPIRED) {
          this.inProgressAction = SignDocumentsAction.ERROR_MSG;
          this.errorData = {
            title: 'رمز عبور شما منقضی شده',
            message: 'به علت تکرار بیش از حد رمز عبور اشتباه، قادر به ادامه فرایند نیستید؛ لطفا با پشتیبانی تماس بگیرید.',
            buttons: [{
              id: 'primary',
              buttonMode: 'default',
              buttonStyle: 'tinted',
              label: 'بازگشت به خانه'
            }],
            staticImage: 'assets/icons/signature-failed.svg'
          };
        } else if (e.error.result.status === errorStatus.MERCHANT_CREDIT_DIGITAL_SIGNATURE_EXPIRED) {
          this.inProgressAction = SignDocumentsAction.ERROR_MSG;
          this.errorData = {
            title: 'امضای شما منقضی شد',
            message: 'با توجه به گذشت ۱ سال از ثبت امضای دیجیتال شما، امضای شما منقضی شده و لازم است مجددا امضای خود را ثبت کنید.',
            buttons: [{
              id: 'primary',
              buttonMode: 'default',
              buttonStyle: 'tinted',
              label: 'بازگشت به خانه'
            }],
            staticImage: 'assets/icons/signature-failed.svg'
          };
        } else if (e.error.result.status === errorStatus.INVALID_PASSWORD) {
          this.errorMessage = 'رمز وارد شده اشتباه است.';
          this.inputDescription = e.error.result.message;
          this.code = '';
        }
        this.signing = false;
        return of(null);
      })
    ).subscribe();
  }

  private signingFinished() {
    // TODO: check this
    this.service.redirect('step/finished');
  }

  private generateDocuments(): void {
    from(this.service.generateSignableDocuments()).pipe(
      tap(response => {
        this.getState();
      }),
      catchError(e => {
        this.messageService.showErrorIfExists(e);
        return of(null);
      })
    ).subscribe();
  }

  onCodeChange(code: string): void {
    if (code && code.length >= 4) {
      this.code = code;
      this.isPassProceed = true;
    } else {
      this.isPassProceed = false;
    }
  }

  onBack(): void {
    switch (this.inProgressAction) {
      case SignDocumentsAction.SIGN_DOCS:
        this.service.goToOverviewPage();
        break;
      case SignDocumentsAction.GETTING_PASSWORD:
        this.inProgressAction = SignDocumentsAction.SIGN_DOCS;
        this.getDocuments();
        this.cardTitle = 'تایید و امضای قرارداد';
        this.isBack = true;
        this.isClose = false;
        break;
      case SignDocumentsAction.ERROR_MSG:
        this.service.goToOverviewPage();
        break;
      case SignDocumentsAction.SENT_CONTRACT_MSG:
        this.service.goToOverviewPage();
        break;
      case SignDocumentsAction.SUCCESS_MSG:
        this.service.goToOverviewPage();
        break;
    }
  }
}
