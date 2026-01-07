import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';
import { SmartDialog } from '../../../../../user-interface/services/smart-dialog';
import { MessageService } from '../../../../../core/message.service';
import { SignatureConfirmationComponent } from './signature-confirmation/signature-confirmation.component';
import {
  GetTicketDetailResponse
} from '../../../../../api/clients/registration/response-models/get-ticket-detail.response';
import { SignatureStatus } from '../../../../../api/models/signature/signature-config.response';
import { SignatureDetailsResponse } from '../../../../../api/models/signature/signature-details.response';
import { RegistrationState } from '../../../../../api/models/registration/states';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

enum SignatureAction {
  INITIAL = 1,
  GET_CONFIG = 2
}

enum RegistrationChanges {
  REMOVE_NATIONAL_CARD_IMAGES = 1,
  DIGITAL_SIGNATURE_WITH_TICKET = 2,
  MIDDLE_EAST_STATE_MACHINE_JOURNEY = 3,
  DIGITAL_SIGNATURE_WITH_PASSWORD = 5,
}

@Component({
  selector: 'step-signature',
  templateUrl: './step-signature.component.html',
  styleUrls: ['./step-signature.component.scss']
})
export class StepSignatureComponent implements OnInit {

  items: { label: string, value: string }[] = [];

  initializing = false;

  errorMessage = '';

  details!: GetTicketDetailResponse;

  ready = false;

  state: 'INITIAL' | 'GET_PASSWORD' | 'CREATED' = 'INITIAL';

  signatureDetails!: SignatureDetailsResponse;

  noticeChecked = false;

  noServiceErrorData: {} = {};

  isError = false;

  isRetryError: boolean = false;

  cardTitle: string = '';
  passwordStatus: 'ONBOARDING' | 'GETTING_PASSWORD' | 'REPEAT_PASSWORD' | 'PREVIEW' | 'ERROR' = 'GETTING_PASSWORD';
  isBack: boolean = true;
  isClose: boolean = false;

  stateToAction: { [key in RegistrationState]?: SignatureAction } = {
    [RegistrationState.DIGITAL_SIGNATURE]: SignatureAction.INITIAL,
    [RegistrationState.DIGITAL_SIGNATURE_PENDING]: SignatureAction.GET_CONFIG
  };
  stateToActionNewUser: { [key in RegistrationState]?: SignatureAction } = {
    [RegistrationState.DIGITAL_SIGNATURE]: SignatureAction.INITIAL,
    [RegistrationState.DIGITAL_SIGNATURE_GENERATE]: SignatureAction.GET_CONFIG
  };

  redirecting: boolean = false;
  registrationChanges: number[] = [];

  constructor(
    private service: RegistrationService,
    private smartDialog: SmartDialog,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getDetail();
    this.service.passwordStatus.subscribe(status => {
      if (!status) return;
      this.passwordStatus = status as 'ONBOARDING' | 'GETTING_PASSWORD' | 'REPEAT_PASSWORD' | 'PREVIEW' | 'ERROR';
    });
  }

  getStatus(): void {
    from(this.service.getStepsFromApi()).pipe(
      map(res => res.currentStep),
      tap(state => {
        if (this.registrationChanges.includes(RegistrationChanges.MIDDLE_EAST_STATE_MACHINE_JOURNEY)) {
          this.handleStateActionForNewUser(state);
        } else {
          this.handleStateAction(state);
        }
      }),
      catchError(error => {
        console.error('Error fetching steps from API:', error);
        return of(null);
      })
    ).subscribe();
  }

  handleStateActionForNewUser(state: RegistrationState){
    if (this.stateToActionNewUser[state]) {
      this.dispatchAction(this.stateToActionNewUser[state]);
    } else {
      this.service.goToOverviewPage();
    }
  }

  handleStateAction(state: RegistrationState){
    if (this.stateToAction[state]) {
      this.dispatchAction(this.stateToAction[state]);
    } else {
      this.service.goToOverviewPage();
    }
  }
  dispatchAction(action?: SignatureAction) {
    switch (action) {
      case SignatureAction.INITIAL:
        this.setInitialData();
        break;
      case SignatureAction.GET_CONFIG:
        this.getConfig();
        break;
    }
  }

  private getConfig() {
    from(this.service.getSignatureConfig()).pipe(
      switchMap(res => {
        switch (res.step) {
          case SignatureStatus.INITIATION:
          case SignatureStatus.REGISTRATION:
            this.setInitialData();
            return of(null);
          case SignatureStatus.SIGNATURE_GENERATION:
            this.service.getTicketDetail().pipe(
              switchMap(details => {
                if (details && details?.registration?.identityInfo?.name) {
                  this.registrationChanges = details?.registration?.registrationChanges;
                  if (this.registrationChanges.includes(RegistrationChanges.DIGITAL_SIGNATURE_WITH_PASSWORD)) {
                    this.ready = true;
                    this.state = 'GET_PASSWORD';
                    this.cardTitle = 'رمز امضای دیجیتال';
                    this.isClose = true;
                    this.isBack = false;
                  } else {
                    return from(this.service.generateSignature()).pipe(
                      switchMap(() => {
                          this.ready = true;
                          return this.getSignatureDetails();
                        }
                      ),
                      catchError(e => {
                        if (e.status === 422 || e.status === 504) {
                          this.isRetryError = true;
                          this.noServiceErrorData = {
                            title: 'متاسفانه، امکان ثبت امضای دیجیتال را نداریم.',
                            message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
                            primaryBtn: 'بستن',
                            secondaryBtn: 'تلاش مجدد',
                            staticImage: 'img-no-service'
                          };
                        }
                        return throwError(() => 'error');
                      })
                    );
                  }
                }
                return of(null);
              }),
              catchError(err => {
                this.messageService.showErrorIfExists(err);
                return of(null);
              })
            ).subscribe();

            return of(null);
          case SignatureStatus.FINALIZED:
            this.getSignatureDetails();
            return of(null);
          default:
            return of(null);
        }
      }),
      catchError(e => {
        if (e.status === 422 || e.status === 504) {
          this.isRetryError = true;
          this.noServiceErrorData = {
            title: 'متاسفانه، امکان ثبت امضای دیجیتال را نداریم.',
            message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
            primaryBtn: 'بستن',
            secondaryBtn: 'تلاش مجدد',
            staticImage: 'img-no-service'
          };
        }
        return of(null);
      })
    ).subscribe();
  }

  private setInitialData() {
    const info = this.details.registration.identityInfo;
    this.items = [
      {label: 'کد ملی', value: info.nationalCode},
      {label: 'نام و نام خانوادگی', value: info.name},
      {label: 'شماره همراه', value: this.details.registration.cellNumber},
      {label: 'نام پدر', value: info.fatherName},
      {label: 'تاریخ تولد', value: info.birthDate},
      {label: 'کدپستی محل سکونت', value: this.details.registration.address.postalCode},
      {label: 'نحوه افتتاح حساب', value: 'تماما آنلاین'},
    ];
    this.ready = true;
    this.cardTitle = 'ثبت امضای دیجیتال';
    this.isClose = false;
    this.isBack = true;
  }

  getDetail() {
    this.service.getTicketDetail(true).subscribe(details => {
      if (details) {
        this.details = details;
        this.registrationChanges = details?.registration?.registrationChanges;
        this.getStatus();
      }
    });
  }

  onBack(): void {
    if (this.registrationChanges.includes(RegistrationChanges.DIGITAL_SIGNATURE_WITH_PASSWORD)) {
      switch (this.passwordStatus) {
        case 'ONBOARDING':
          this.service.goToOverviewPage();
          break;
        case 'GETTING_PASSWORD':
          this.service.goToOverviewPage();
          this.service.passwordStatus.next('GETTING_PASSWORD');
          break;
        case 'REPEAT_PASSWORD':
          this.service.passwordStatus.next('GETTING_PASSWORD');
          this.cardTitle = 'رمز امضای دیجیتال';
          this.isClose = true;
          this.isBack = false;
          break;
        case 'PREVIEW':
          this.service.goToOverviewPage();
          this.cardTitle = 'رمز امضای دیجیتال';
          this.isClose = true;
          this.isBack = false;
          break;
        case 'ERROR':
          this.service.goToOverviewPage();
          this.cardTitle = 'ثبت رمز امضای دیجیتال';
          this.isClose = true;
          this.isBack = false;
          break;
      }
    } else {
      this.service.goToOverviewPage();
    }
  }

  proceed(): void {
    this.smartDialog.open(SignatureConfirmationComponent, {}).then(agreed => {
      if (agreed) {
        this.getTrackingCodeAndRedirect();

      }
    });
  }

  private getSignatureDetails(): Observable<any> {
    return this.service.getSignatureDetailsForNewUsers().pipe(
      map(res => {
        this.signatureDetails = res;
        this.ready = true;
        this.state = 'CREATED';
        this.cardTitle = 'ثبت امضای دیجیتال';
        this.isClose = false;
        this.isBack = true;
        return res;
      })
    );
  }

  private getTrackingCodeAndRedirect() {
    this.initializing = true;

    from(this.service.initializeDigitalSignature()).pipe(
      tap(res => {
        this.initializing = false;
        this.redirectLivenessDetection(res.trackingCode);
      }),
      catchError(e => {
        this.initializing = false;
        if (e.status === 422 || e.status === 504) {
          this.isRetryError = true;
          this.noServiceErrorData = {
            title: 'متاسفانه، امکان ثبت امضای دیجیتال را نداریم.',
            message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
            primaryBtn: 'بستن',
            secondaryBtn: 'تلاش مجدد',
            staticImage: 'img-no-service'
          };
        }
        return of(null);
      })
    ).subscribe();
  }

  private redirectLivenessDetection(trackingCode: string): void {
    this.redirecting = true;
    this.service.getRedirectToSignatureProvider(trackingCode).then(url => {
      window.location.replace(url);
      this.redirecting = false;
    }).catch(e => {
      this.redirecting = false;
      if (e.error.result.status === 1000) {
        this.isRetryError = true;
        this.noServiceErrorData = {
          title: 'متاسفانه، امکان ثبت امضای دیجیتال را نداریم.',
          message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
          primaryBtn: 'بستن',
          secondaryBtn: 'تلاش مجدد',
          staticImage: 'img-no-service'
        };
      }
      this.messageService.showErrorIfExists(e);
    });
  }

  callSupport() {
    window.open('tel:+982153924000');
  }

  onRetry() {
    this.isRetryError = false;
    this.getStatus();
  }

  cardInfo(event: any) {
    this.cardTitle = event.cardTitle;
    this.isClose = event.isClose;
    this.isBack = event.isBack;
  }
}
