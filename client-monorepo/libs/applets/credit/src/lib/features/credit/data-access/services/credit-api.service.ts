import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { VolunteerRegisterResponse } from '../models/credit/volunteer/volunteer-register-response.model';
import { ActivationResponse } from '../models/credit/activation/activation-response.model';
import { WalletsResponse } from '../models/credit/wallet/wallets-response.model';
import { CreditScore } from '../models/credit/score/credit-score.model';
import { CreditTacResponse } from '../models/credit/credit-tac-response.model';
import { STEP_STATUSES } from '../models/credit/activation/step-statuses';
import { STEP_TYPES } from '../models/credit/activation/step-types';
import { STEP_TAGS } from '../models/credit/activation/step-tags';
import { InstallmentPaymentTicketResponse } from '../models/credit/installment/installment-payment-ticket-response.model';
import { ConfigResponse } from '../models/credit/activation/config-response.model';
import { transformStepCodeToText } from '../models/credit/activation/step-codes';
import { CreditProfileResponse, UserAddressesResponse } from '../models/credit/profile/credit-profile-response.model';
import { CreditProfileUpdateRequest } from '../models/credit/profile/credit-profile-update-request.model';
import { DocumentUploadResponse } from '../models/credit/document/document-upload-response.model';
import { Step } from '../models/credit/activation/step.model';
import { ActivateWalletResponse } from '../models/credit/wallet/activate-wallet-response.model';
import { OnboardingDataResponse } from '../models/credit/volunteer/onboarding-data.response';
import { VolunteerStateResponse } from '../models/credit/volunteer/volunteer-state.response';
import { PreRegisterRequest } from '../models/credit/volunteer/pre-register.request';
import { PreRegisterResponse } from '../models/credit/volunteer/pre-register.response';
import { IbanInfoResponse } from '../models/credit/iban/iban-info.response';
import { ChequeStepDetailResponseModel } from '../models/credit/activation/cheque-step/cheque-step-detail-response.model';
import { CreditContractListResponse } from '../models/credit/contracts/credit-contract-list.response';
import { CreditContractDetailResponse } from '../models/credit/contracts/credit-contract-detail.response';
import { CreditPlanDetailResponse } from '../models/credit/pre-registration/credit-plan-detail.response';
import { BaseApiService } from './base-api.service';
import { GenericApiResponse } from '../models/generic-api-response.model';
import { VolunteersDetailResponse } from '../models/credit/volunteer/volunteers-detail.response';
import { CancelActivationReasonsResponse } from '../models/credit/activation/cancel-activation/cancel-activation-reasons.response';
import { GetActivationStepDetailResponse } from '../models/credit/activation/get-activation-step-detail.response';
import { SendChequeDataResponse } from '../models/credit/activation/send-cheque-data.response';
import { GetChequeOwnerAddressResponse } from '../models/credit/activation/get-cheque-owner-address.response';
import { CreditPaymentStepConfigResponse } from '../models/credit/activation/credit-payment-step-config.response';
import { CreditPaymentStepInitResponse } from '../models/credit/activation/credit-payment-step-init.response';
import { GetBankAccountVerificationStatusResponse } from '../models/credit/activation/get-bank-account-verification-status.response';
import { GetDigitalSignatureOnlineContractStatus } from '../models/credit/activation/get-digital-signature-online-contract-status';
import { ContractInstallmentSummaryListResponse } from '../models/credit/installment/contract-installment-summary-list.response';
import { ContractPurchasesResponse } from '../models/credit/installment/contract-purchases.response';
import { InstallmentPayConfigResponse } from '../models/credit/installment/installment-pay-config.response';
import { CreditProfileStatusResponse } from '../models/credit/activation/credit-profile-status.response';
import { CreditProfileStepResponse } from '../models/credit/profile/credit-profile-step.response';
import { ChequeOnBoardingResponse } from '../models/credit/activation/cheque-step/cheque-on-boarding.response';
import { GetGenerateDigitalSignatureStepStatusResponse } from '../models/credit/activation/generate-digital-signature-step/get-generate-digital-signature-step-status.response';
import { GetDigitalSignatureGenerationUserInfoResponse } from '../models/credit/activation/generate-digital-signature-step/get-digital-signature-generation-user-info.response';
import { DigitalSignatureGenerationOnBoardingResponse } from '../models/credit/activation/generate-digital-signature-step/get-digital-signature-generation-on-boarding.response';
import { GetDigitalSignatureImageResponse } from '../models/credit/activation/generate-digital-signature-step/get-digital-signature-image.response';
import { RegisterDigitalSignatureResponse } from '../models/credit/activation/generate-digital-signature-step/register-digital-signature.response';
import { GetSigningDocumentsOnBoardingResponse } from '../models/credit/activation/signing-documents-step/get-signing-documents-on-boarding.response';
import { GetSigningDocumentsStatusResponse } from '../models/credit/activation/signing-documents-step/get-signing-documents-status.response';
import { GetSigningDocumentsListItemsResponse } from '../models/credit/activation/signing-documents-step/get-signing-documents-list-items.response';
import { GetSigningDocumentsItem } from '../models/credit/activation/signing-documents-step/get-signing-documents-item';
import { CreditEarlySettlementDetailResponse } from '../models/credit/installment/credit-early-settlement-detail.response';
import { CreditEarlySettlementPayConfigResponse } from '../models/credit/installment/credit-early-settlement-pay-config.response';
import { GetEnoteStepStatusResponse } from '../models/credit/activation/enote-step/get-enote-step-status.response';
import { GetEnotePaymentConfigResponse } from '../models/credit/activation/enote-step/get-enote-payment-config.response';
import { EnotePaymentCallbackResponse } from '../models/credit/activation/enote-step/enote-payment-callback.response';
import { EnotePaymentInitResponse } from '../models/credit/activation/enote-step/enote-payment-init.response';
import { GetEnoteOnBoardingPageResponse } from '../models/credit/activation/enote-step/get-enote-on-boarding-page.response';
import { GetPlanGroupsResponse } from '../models/credit/pre-registration/get-plan-groups.response';
import { CancelActivationResponse } from '../models/credit/activation/cancel-activation/cancel-activation.response';
import { CancelActivationAccessResponse } from '../models/credit/activation/cancel-activation/cancel-activation-access.response';
import { InquiryUnderwriterResponse } from '../models/credit/underwriter/inquiry-underwriter.response';
import { InquiryUnderwriterRequest } from '../models/credit/underwriter/inquiry-underwriter.request';
import { AccountBlockStepStatusResponse } from '../models/credit/activation/account-block-step/account-block-step-status.response';
import { GetWalletResponse } from '../models/credit/wallet/get-wallet.response';
import { CheckCreditFileStatusResponse } from '../models/credit/activation/check-credit-file/check-credit-file-status.response';
import { GetConfigRequest } from '../models/credit/installment/installments-config.request';
import { GetTicketRequest, GetTicketVersion2Request } from '../models/credit/installment/installments-ticket.request';
import { CreditServiceTypeService } from './credit-service-type.service';
import { InstallmentSellsOnBoardingResponse } from '../models/credit/activation/cheque-step/installment-sells-on-boarding.response';
import { InstallmentSellsGuideResponse } from '../models/credit/activation/cheque-step/installment-sells-guide.response';
import { InstallmentSellsStatusResponse } from '../models/credit/activation/cheque-step/installment-sells-status.response';
import { InstallmentSaleDocumentResponse } from '../models/credit/activation/cheque-step/installment-sale-document.response';
import { CreditAgreementsResponse } from '../models/credit/agreements/credit-agreements-response';
import { GetEnoteSelectConfigResponse } from '../models/credit/activation/enote-step/get-enote-select-config.response';
import { SubscriptionStatusResponse } from '../models/credit/activation/subscription/subscription-status.response';
import { BankAccountPageInformationResponse } from '../models/credit/installment/bank-account-page-information.response';
import { CreditTicketTypes, TicketVersion2Response } from '../models/credit/ticket-version2/ticket-version2.response';
import { GetNoteSwitchTypePossibilityResponse } from '../models/credit/activation/enote-step/get-note-switch-type-possibility.response';
import { OnboardPhysicalNotePayload } from '../models/credit/activation/enote-step/onboard-physical-note-payload';
import { InitPhysicalNotePayload } from '../models/credit/activation/enote-step/init-physical-note-payload';
import { PhysicalNoteGuideResponse } from '../models/credit/activation/enote-step/physical-note-guide-response';
import { PhysicalNoteDetailResponse } from '../models/credit/activation/enote-step/physical-note-detail-response';
import { EducationsResponse } from '../models/credit/education/edjucation.response';
import { JobsResponse } from '../models/credit/job/job.response';
import { HttpHeaders } from '@angular/common/http';
import { DigitalSignatureDetailsResponse } from '../models/credit/activation/generate-digital-signature-step/general-digital-signature-details';
import { DigitalSignatureVideoAdmittanceTextResponse } from '../models/credit/activation/generate-digital-signature-step/digital-signature-video-admittance-text.response';
import { CampaignWalletResponse } from '../models/bnpl/campaigns/campaign-wallet.response';
import { CampaignWalletRequest } from '../models/bnpl/campaigns/campaign-wallet.request';
import { SERVICE_TYPE_SUBSCRIPTION_ENUM } from '../models/bnpl/service-type-subscription/service-type-subscription.enum';
import { TotalInstallmentsResponse } from '../models/credit/total-installments/total-installments';
import { InstallmentSaleCartReservationResponse } from '../models/credit/activation/cheque-step/installment-sale-cart-reservation.response';
import { InstallmentSaleReservationType } from '../models/credit/activation/cheque-step/installment-sale-reservation-type';
import { GetUserHasDigitalSignatureResponse } from '../models/credit/activation/generate-digital-signature-step/get-user-has-digital-signature.response';
import { SERVICE_TYPE } from '../models/credit/service-type/service-type.model';
import { ChequeStatusResponse } from '../models/credit/activation/cheque-step/cheque-status-response';
import { ALLOCATION_PAYMENT_METHOD } from '../models/credit/pre-registration/credit-plan-group';
import { InstallmentPayLinkResponse } from '../models/credit/installment-pay-link/installment-pay-link.response';
import {
  RegisterIplTicketBody,
  RegisterIplTicketDetail,
  RegisterIplTicketResponse,
} from '../../installment-pay-link/data-access/register-ipl-ticket';
import {
  BranchAvailabilityScheduleModel,
  ChequeDeliveryReserveCourierPayload,
  ChequeDeliveryReserveInPersonPayload,
  CourierAvailabilityScheduleModel,
  ProvinceDeliveryMethodModel,
} from '../models/credit/activation/cheque-step/cheque-step-delivery.model';
import { CreditIcsSettingResponse } from '../models/credit/score/credit-score-setting-response';
import { isCurrentTimeBetween } from '../utils/check-string-time-validation';
import { InstallmentRefererShortKey } from '../models/credit/installment/installment-referer.model';
import { UserType } from '../models/credit-smart-scoring/pre-signup-request.payload';
import {
  CreditPaymentStepStatusResponse,
  CreditPrePaymentStepStatusResponse,
} from '../models/credit/activation/credit-payment-step-status.response';

enum RestrictionTypes {
  SIMPLE = 'simple',
  COLLECTION = 'collection',
  RANGE = 'range',
}

enum StoreRestrictionFields {
  TITLE = 'title',
  CATEGORIES = 'categories',
  KEYWORD = 'keyword',
  PAYMENT_METHODS = 'paymentMethods',
  SORT = 'sort',
  STORE_TYPE = 'types',
  IS_DEACTIVE = 'state.disabled',
}

@Injectable({
  providedIn: 'root',
})
export class CreditApiService {
  private creditServiceTypeService = inject(CreditServiceTypeService);
  private api = inject(BaseApiService);

  register(formData: object): Observable<VolunteerRegisterResponse> {
    return this.api.post('volunteers', formData);
  }

  /**
   * Get credit wallets list
   */
  getCreditWallets(): Observable<WalletsResponse | any> {
    const path = this.creditServiceTypeService.giveResultByType<string>('credit/wallet-cards', 'credit/wallet-cards/bnpl');
    return this.api.get(path).pipe(
      map((response: any) => {
        response.creditWallets = response.creditWallets.map((item: any) => {
          const updatedItem = {
            ...item,
            color: BaseApiService.convertDecimalToRgba(item.color),
            type: 'WALLET',
            title: item.title,
            topCardTitle: item.title,
          };

          if (item.serviceType === SERVICE_TYPE.BNPL && item.installmentCount > 1) {
            updatedItem.installmentCount = item.installmentCount + 1;
          }

          if (item.serviceType === SERVICE_TYPE.BNPL) {
            if (item.installmentCount === 1) {
              updatedItem.topCardTitle = 'اعتبار ماهانه';
            } else {
              updatedItem.topCardTitle = `اعتبار ${item.installmentCount + 1} قسطه`;
            }
          }

          if (item.serviceType === SERVICE_TYPE.CREDIT) {
            updatedItem.topCardTitle = `${item.title} (${item.installmentCount} قسط)`;
          }

          return updatedItem;
        });

        response.creditVolunteers = response.creditVolunteers.map((item: any) => {
          return Object.assign(item, {
            color: BaseApiService.convertDecimalToRgba(item.color),
            type: 'VOLUNTEER',
          });
        });
        return response;
      }),
    );
  }

  getCreditWallet(creditId: string): Observable<GetWalletResponse> {
    return this.api.get(`credit/wallets/${creditId}`).pipe(
      map((response: any) => {
        if (response.creditWallet && response.creditWallet.color) {
          response.creditWallet = Object.assign(response.creditWallet, {
            color: BaseApiService.convertDecimalToRgba(response.creditWallet.color),
            type: 'WALLET',
          });
        }
        return response;
      }),
    );
  }

  getUserInfoForPayByLink(uuid: string, referer: string | null): Observable<InstallmentPayLinkResponse> {
    const queryParam = referer ? `?${InstallmentRefererShortKey}=${referer}` : '';
    return this.api.get(`installment/payment-orders/credit-link/debt-summary-extended/${uuid}${queryParam}`);
  }

  registerInstallmentPayLinkTicket(
    uuid: string,
    referer: string | null = null,
    ticketDetails: RegisterIplTicketDetail[] | null = null,
    callbackUrl: string,
  ): Observable<RegisterIplTicketResponse> {
    const queryParam = referer ? `?${InstallmentRefererShortKey}=${referer}` : '';

    const payload: RegisterIplTicketBody = {
      callbackUrl,
    };

    if (ticketDetails) {
      payload.ticketRequestDetails = ticketDetails;
    }

    return this.api.post(`installment/payment-orders/credit-link/ticket/${uuid}${queryParam}`, payload);
  }

  /**
   * Get steps of the credit wallet activation
   * and set the value of some additional keys
   *
   */
  getActivation(fundProviderCode: string | number, creditId: string): Observable<ActivationResponse> {
    return this.api.get(`credit/activations/${fundProviderCode}/${creditId}`).pipe(
      map((r) => {
        const response = r as ActivationResponse;
        if (response.steps.length > 0) {
          response.steps = response.steps
            .map((step) => {
              step = this.transformStep(step);
              step.activationTitle = response.title;
              if (step.child && step.child.length > 0) {
                step.child = step.child.map((childStep) => {
                  childStep = this.transformStep(childStep);
                  return childStep;
                });
              }
              return step;
            })
            .filter((step) => {
              return ['INIT', 'REGISTER'].indexOf(step.kind) < 0;
            });
        }
        return response;
      }),
    );
  }

  getCreditScoreStepSetting(): Observable<CreditIcsSettingResponse> {
    return this.api.get('credit/scores/settings').pipe(
      map((response) => {
        if (
          response &&
          (!response.enabled || (response.fromTime && response.toTime && !isCurrentTimeBetween(response.fromTime, response.toTime)))
        ) {
          response.limitted = true;
        }
        return response;
      }),
    );
  }

  /**
   * Gets the user score in the banking system
   */
  getBankScore(): Observable<CreditScore | any> {
    return this.api.get('credit/scores/bank');
  }

  /**
   * Gets the user score in the banking system
   */
  getBankScoreForFundProvider(fundProviderCode: string | number, creditId: string): Observable<CreditScore | any> {
    return this.api.post(`credit/scores/bank/${fundProviderCode}/${creditId}`);
  }

  /**
   * Get digipay score
   */
  getDigipayScore(): Observable<CreditScore | any> {
    return this.api.get('credit/scores/digipay');
  }

  /**
   * Get ticket paying the given installment
   */
  getTicketForInstallmentPay(
    payload: GetTicketRequest,
    callbackUrl: string,
    referer?: string,
  ): Observable<InstallmentPaymentTicketResponse> {
    const queryParam = referer ? `?${InstallmentRefererShortKey}=${referer}` : '';
    return this.api.post(`installment/payment-orders/ticket${queryParam}`, {
      ...payload,
      callbackUrl,
    });
  }

  /**
   * Gets some configuration parameters from the API
   */
  getActivationConfig(): Observable<ConfigResponse> {
    return this.api.get('credit/activations/config');
  }

  /**
   * Get user profile
   */
  getCreditProfile(): Observable<CreditProfileResponse> {
    return this.api.get('credit/users/profile').pipe(
      map((response) => {
        const fields: any = {};
        response.fields.forEach((f: any) => {
          fields[f.name] = f;
        });
        return Object.assign(response, { fields });
      }),
    );
  }

  /**
   * Update user profile
   */
  updateCreditProfile(body: CreditProfileUpdateRequest, fundProviderCode: number, creditId: string): Observable<any> {
    return this.api.post(`credit/users/profile/${fundProviderCode}/${creditId}`, body);
  }

  uploadDocument(
    isInstallment: boolean,
    file: File,
    creditId: string,
    fundProviderCode: number,
    stepTag: number,
    order: number,
  ): Observable<DocumentUploadResponse> {
    if (isInstallment) {
      return this.uploadDocumentInstallmentSale(file, creditId, order);
    }
    return this.uploadCollateralChequeDocument(file, fundProviderCode, creditId, stepTag);
  }

  /**
   *
   */
  uploadCollateralChequeDocument(
    file: File,
    fundProviderCode: number,
    creditId: string,
    stepTag: number,
  ): Observable<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.multiPartUpload(`credit/documents/${fundProviderCode}/${creditId}/${stepTag}`, formData);
  }

  uploadDocumentInstallmentSale(file: File, creditId: string, order: number): Observable<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.multiPartUpload(`credit/installment-cheques/upload/${creditId}/${order}`, formData);
  }

  confirmDocument(fundProviderCode: number, creditId: string, type: number): Observable<any> {
    return this.api.post(`credit/documents/confirm/${fundProviderCode}/${creditId}/${type}`);
  }

  /**
   * Get tac configuration (url, title, etc.)
   */
  getTacData(type: 'bnpl' | 'credit' = 'credit'): Observable<CreditTacResponse> {
    return this.api.get(`${type}/tac/general`);
  }

  /**
   * Get HTML of the TAC page (using the tacTextUrl)
   */
  getTacPage(response: CreditTacResponse): Observable<any> {
    return this.api.getHtml(response.tacTextUrl);
  }

  /**
   * Confirm credit tac
   */
  confirmTac(type: 'credit' | 'bnpl' = 'credit'): Observable<any> {
    return this.api.post(`${type}/tac/general`, {});
  }

  /**
   * Activate wallet (final API)
   */
  activateWallet(fundProviderCode: number, creditId: string): Observable<ActivateWalletResponse> {
    return this.api.post(`credit/wallets/activate/${fundProviderCode}/${creditId}`);
  }

  getOnBoardingData(): Observable<OnboardingDataResponse> {
    return this.api.get('credit/volunteers/on-board').pipe(
      map((response: OnboardingDataResponse) => {
        if (response.pages) {
          response.pages = response.pages.sort((item) => item.order);
        }

        return response;
      }),
    );
  }

  userFinishedOnboarding(): Observable<GenericApiResponse> {
    return this.api.post('credit/volunteers/on-board');
  }

  getVolunteerState(): Observable<VolunteerStateResponse> {
    return this.api.get('credit/volunteers/state').pipe(
      map((response: VolunteerStateResponse) => {
        if (response.chequeGuideUrl) {
          response.chequeGuideUrl = response.chequeGuideUrl.replace('/files/', '');
        }
        if (response.cellOwnershipGuideUrl) {
          response.cellOwnershipGuideUrl = response.cellOwnershipGuideUrl.replace('/files/', '');
        }

        return response;
      }),
    );
  }

  getProvinces(): Observable<any> {
    return this.api.get('credit/provinces');
  }

  getEducations(): Observable<EducationsResponse> {
    return this.api.get('credit/educations');
  }

  getJobs(creditId: string): Observable<JobsResponse> {
    return this.api.get(`credit/jobs/${creditId}`);
  }

  getUserAddresses(): Observable<UserAddressesResponse> {
    return this.api.get(`credit/addresses/user-addresses`);
  }

  registerVolunteer(request: PreRegisterRequest): Observable<PreRegisterResponse> {
    return this.api.post('credit/volunteers/pre-register', request);
  }

  getIbanInfo(iban: string): Observable<IbanInfoResponse> {
    return this.api.get(`banks/ibans/${iban}`);
  }

  getChequeStepDetail(fundProviderCode: number, creditId: string): Observable<ChequeStepDetailResponseModel> {
    return this.api.get(`credit/cheques/detail/${fundProviderCode}/${creditId}`);
  }

  sendChequeData(fundProviderCode: number, creditId: string, body: any): Observable<SendChequeDataResponse> {
    return this.api.post(`credit/cheques/${fundProviderCode}/${creditId}`, body);
  }

  getCollateralChequeGuid(creditId: string) {
    return this.api.get(`credit/cheques/guide/v2/${creditId}`);
  }

  getChequeGuid(creditId: string, isInstallment: boolean, chequeOrder: number) {
    if (isInstallment) {
      return this.getInstallmentSellsGuide(creditId, chequeOrder);
    }
    return this.getCollateralChequeGuid(creditId);
  }

  chequesConfirm(fundProviderCode: number, creditId: string) {
    return this.api.post(`credit/cheques/confirm/${fundProviderCode}/${creditId}`);
  }

  getChequeDeliveryLocations(): Observable<ProvinceDeliveryMethodModel> {
    return this.api.get(`credit/cheque-physics/pick-up/provinces`);
  }

  getAvailableBranchDatesByCityIdAndCreditId(cityId: number): Observable<BranchAvailabilityScheduleModel> {
    return this.api.get(`credit/cheque-physics/pick-up/branches/available-time/${cityId}`);
  }

  getAvailablePickupDatesByCityId(cityId: number): Observable<CourierAvailabilityScheduleModel> {
    return this.api.get(`credit/cheque-physics/pick-up/courier/available-time/${cityId}`);
  }

  chequeDeliveryReservePost(creditId: string, cityId: number) {
    return this.api.post(`credit/cheque-physics/pick-up/reserve/post/${creditId}`, { cityId });
  }

  chequeDeliveryReserveCourier(creditId: string, reservePayload: ChequeDeliveryReserveCourierPayload) {
    return this.api.post(`credit/cheque-physics/pick-up/reserve/courier/${creditId}`, reservePayload);
  }

  chequeDeliveryReserveInPerson(creditId: string, reservePayload: ChequeDeliveryReserveInPersonPayload) {
    return this.api.post(`credit/cheque-physics/pick-up/reserve/in-person/${creditId}`, reservePayload);
  }

  getCreditContractsList(fundProviderCode: number, creditId: string): Observable<CreditContractListResponse> {
    return this.api.get(`credit/contracts/summary/${fundProviderCode}/${creditId}`);
  }

  getCreditContractDetail(contractTrackingCode: string, fundProviderCode: number): Observable<CreditContractDetailResponse> {
    return this.api.get(`credit/contracts/${contractTrackingCode}?fpCode=${fundProviderCode}`);
  }

  getFinalContractPage(fundProviderCode: number, creditId: string): Observable<string> {
    return this.api.getHtml(`credit/contracts/final-contract/${fundProviderCode}/${creditId}`);
  }

  getPlanDetail(planId: string): Observable<CreditPlanDetailResponse> {
    return this.api.get(`credit/plans/receipt/${planId}`).pipe(
      map((response) => {
        // Convert card color to RGBA if exists
        if (response.card && response.card.color) {
          response.card.color = BaseApiService.convertDecimalToRgba(response.card.color);
        }
        // Additional logic for BNPL service type with multiple installments
        if (response.serviceType === SERVICE_TYPE.BNPL && response.card.installmentCount > 1) {
          response.card.installmentCount += 1;
        }

        return response;
      }),
    );
  }

  preRegisterByCampaign(campaignId: string) {
    return this.api.post(`credit/campaigns/apply/${campaignId}`);
  }

  getVolunteersDetail(): Observable<VolunteersDetailResponse> {
    return this.api.get(`credit/volunteers/detail`);
  }

  getActivationStepDetail(fundProviderCode: number, creditId: string, stepCode: number): Observable<GetActivationStepDetailResponse> {
    return this.api.get(`credit/activations/step/info/${fundProviderCode}/${creditId}/${stepCode}`).pipe(
      map((response: GetActivationStepDetailResponse) => {
        response.stepFlow.forEach((stepFlow) => {
          if (stepFlow.step) {
            stepFlow.step = this.transformStep(stepFlow.step);
            if (stepFlow.step.child && stepFlow.step.child.length > 0) {
              stepFlow.step.child = stepFlow.step.child.map((childStep) => {
                childStep = this.transformStep(childStep);
                return childStep;
              });
            }
          }
        });
        return response;
      }),
    );
  }

  updateChequeOwnerAddress(fundProviderCode: number, creditId: string, body: any): Observable<any> {
    return this.api.post(`credit/cheques/guarantor-address/${fundProviderCode}/${creditId}`, body);
  }

  getChequeOwnerAddress(fundProviderCode: number, creditId: string): Observable<GetChequeOwnerAddressResponse> {
    return this.api.get(`credit/cheques/guarantor-address/${fundProviderCode}/${creditId}`);
  }

  getPaymentStepConfig(creditId: string, fundProviderCode: number): Observable<CreditPaymentStepConfigResponse> {
    return this.api.post(`credit/payments/configs`, {
      creditId,
      fundProviderCode,
    });
  }

  getPaymentStepStatus(creditId: string): Observable<CreditPaymentStepStatusResponse> {
    return this.api.get(`credit/payments/status/${creditId}`);
  }

  initPaymentStep(
    creditId: string,
    fundProviderCode: number,
    callbackUrl: string,
    urlAfterResult: string,
  ): Observable<CreditPaymentStepInitResponse> {
    return this.api.post(`credit/payments/init`, {
      creditId,
      fundProviderCode,
      redirectUrl: callbackUrl,
      redirectDetailAfterResult: {
        text: 'ادامه فرآیند',
        method: 1,
        path: urlAfterResult,
      },
    });
  }

  getPrePaymentStepConfig(creditId: string, fundProviderCode: number): Observable<CreditPaymentStepConfigResponse> {
    return this.api.post(`credit/allocation-prepayments/configs`, {
      creditId,
      fundProviderCode,
    });
  }

  getPrePaymentStepStatus(creditId: string): Observable<CreditPrePaymentStepStatusResponse> {
    return this.api.get(`credit/allocation-prepayments/status/${creditId}`);
  }

  initPrePaymentStep(
    creditId: string,
    fundProviderCode: number,
    callbackUrl: string,
    urlAfterResult: string,
  ): Observable<CreditPaymentStepInitResponse> {
    return this.api.post(`credit/allocation-prepayments/init`, {
      creditId,
      fundProviderCode,
      redirectUrl: callbackUrl,
      redirectDetailAfterResult: {
        text: 'ادامه فرآیند',
        method: 1,
        path: urlAfterResult,
      },
    });
  }

  getBankAccountVerificationStatus(creditId: string, fundProviderCode: number): Observable<GetBankAccountVerificationStatusResponse> {
    return this.api.get(`/credit/bank-accounts/status/${fundProviderCode}/${creditId}`);
  }

  retryBankAccountVerificationStatus(creditId: string, fundProviderCode: number): Observable<GenericApiResponse> {
    return this.api.post(`/credit/bank-accounts/verify`, {
      creditId,
      fundProviderCode,
    });
  }

  getDigitalSignAndContractStatus(
    creditId: string,
    fundProviderCode: number,
    signGenerationAbility: boolean,
  ): Observable<GetDigitalSignatureOnlineContractStatus> {
    const queryParams = signGenerationAbility ? '?abilitySign=true' : '';
    return this.api.get(`credit/activations/digital-signatures-online-contract/status/${fundProviderCode}/${creditId}${queryParams}`);
  }

  getWalletInstallments(creditId: string): Observable<ContractInstallmentSummaryListResponse> {
    return this.api.get(`contracts/summary/${creditId}`).pipe(
      map((response: ContractInstallmentSummaryListResponse) => {
        response.header.color = response.header.color ? BaseApiService.convertDecimalToRgba(+response.header.color) : '#0040ff';
        return response;
      }),
    );
  }

  getContractPurchases(contractTrackingCode: string): Observable<ContractPurchasesResponse> {
    return this.api.get(`credit/contracts/detail/${contractTrackingCode}`);
  }

  getWalletPurchases(creditId: string): Observable<ContractPurchasesResponse> {
    return this.api.get(`credit/transactions/${creditId}`);
  }

  getInstallmentPayConfig(payload: GetConfigRequest, referer?: string): Observable<InstallmentPayConfigResponse> {
    const queryParam = referer ? `?${InstallmentRefererShortKey}=${referer}` : '';
    return this.api.post(`installment/payment-orders/configs${queryParam}`, payload);
  }

  getBankAccountPageInformation(creditId: string): Observable<BankAccountPageInformationResponse> {
    return this.api.get(`credit/accounts/provider/${creditId}`);
  }

  getProfileStepStatus(creditId: string): Observable<CreditProfileStatusResponse> {
    return this.api.get(`credit/activations/profile/status/${creditId}`);
  }

  getRunProcessOfProfileStep(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/profile/in-progress/${creditId}`);
  }

  preRegisterCorrection(creditId: string, body: { birthDate: number }): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/profile/correction/${creditId}`, body);
  }

  getCreditProfileStepData(creditId: string): Observable<CreditProfileStepResponse> {
    return this.api.get(`credit/activations/profile/fields/${creditId}`).pipe(
      map((response) => {
        if (!response || !response.fields) {
          return response;
        }

        response.fields.forEach((item: any, key: any) => {
          if (item.name === 'city') {
            response.fields[key].name = 'cityUid';
          }
          if (item.name === 'province') {
            response.fields[key].name = 'provinceUid';
          }
        });
        return response;
      }),
    );
  }

  retryProfileInquiry(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/profile/retry/${creditId}`);
  }

  getChequeOnBoarding(creditId: string): Observable<ChequeOnBoardingResponse> {
    return this.api.get(`credit/cheques/on-board/${creditId}`);
  }

  getChequeStatus(creditId: string): Observable<ChequeStatusResponse> {
    return this.api.get(`credit/cheques/status/${creditId}`);
  }

  getDigitalSignatureGenerationOnBoarded(creditId: string): Observable<DigitalSignatureGenerationOnBoardingResponse> {
    return this.api.post(`credit/activations/digital-signatures/on-board/${creditId}`);
  }

  getDigitalSignatureGenerationStatus(creditId: string): Observable<GetGenerateDigitalSignatureStepStatusResponse> {
    return this.api.get(`credit/activations/digital-signatures/status/${creditId}`, undefined, new HttpHeaders({ isNative: 'true' }));
  }

  getDigitalSignatureGenerationUserInfo(creditId: string): Observable<GetDigitalSignatureGenerationUserInfoResponse> {
    return this.api.get(`credit/activations/digital-signatures/user-info/${creditId}`);
  }

  uploadWetDigitalSignature(formData: FormData, creditId: string): Observable<GenericApiResponse> {
    return this.api.multiPartUpload(`credit/activations/digital-signatures/user-signature/${creditId}`, formData);
  }

  uploadDigitalSignatureSelfieImage(formData: FormData, creditId: string): Observable<GenericApiResponse> {
    return this.api.multiPartUpload(`credit/activations/digital-signatures/user-selfie/${creditId}`, formData);
  }

  getDigitalSignatureVideoAdmittanceText(creditId: string): Observable<DigitalSignatureVideoAdmittanceTextResponse> {
    return this.api.get(`credit/activations/digital-signatures/admittance-text/${creditId}`);
  }

  uploadDigitalSignatureSelfieVideo(formData: FormData, creditId: string): Observable<GenericApiResponse> {
    return this.api.multiPartUpload(`credit/activations/digital-signatures/user-selfie-video/${creditId}`, formData);
  }

  resetDigitalSignatureStatus(creditId: string): Observable<GenericApiResponse> {
    return this.api.put(`credit/activations/digital-signatures/reset/${creditId}`);
  }

  getDigitalSignatureDetails(creditId: string): Observable<DigitalSignatureDetailsResponse> {
    return this.api.get(`credit/activations/digital-signatures/detail/${creditId}`);
  }

  getDigitalSignatureImage(): Observable<GetDigitalSignatureImageResponse> {
    return this.api.get(`credit/activations/digital-signatures/image`);
  }

  getUserHasSignature(): Observable<GetUserHasDigitalSignatureResponse> {
    return this.api.get(`credit/activations/digital-signatures/actual-signature`);
  }

  registerDigitalSignatureInfoForm(
    creditId: string,
    data: {
      englishName: string;
      englishSurname: string;
      nationalCardSerial: string;
    },
  ): Observable<RegisterDigitalSignatureResponse> {
    return this.api.post(
      `credit/activations/digital-signatures/register/${creditId}`,
      Object.assign({}, data),
      new HttpHeaders({ isNative: 'true' }),
    );
  }

  generateDigitalSignature(creditId: string, password: string | null = null): Observable<GenericApiResponse> {
    const payload: { password?: string } = password ? { password } : {};
    return this.api.post(`credit/activations/digital-signatures/generate/${creditId}`, payload);
  }

  validateDigitalSignature(creditId: string, password: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/digital-signatures/validate-password/${creditId}`, { password: password });
  }

  getSigningDocumentsStatus(creditId: string): Observable<GetSigningDocumentsStatusResponse> {
    return this.api.get(`credit/activations/signing-documents/status/${creditId}`);
  }

  getSigningDocumentsOnBoarding(creditId: string): Observable<GetSigningDocumentsOnBoardingResponse> {
    return this.api.get(`credit/activations/signing-documents/on-board/${creditId}`);
  }

  generateDocumentsForSigning(creditId: string): Observable<GenericApiResponse> {
    return this.api.get(`credit/activations/signing-documents/signable/start-generation/${creditId}`);
  }

  getSigningDocumentsListItems(creditId: string): Observable<GetSigningDocumentsListItemsResponse> {
    return this.api.get(`credit/activations/signing-documents/signable/${creditId}`).pipe(
      map((response: GetSigningDocumentsListItemsResponse) => {
        response.documents.sort((a, b) => a.order - b.order);
        return response;
      }),
    );
  }

  getSigningDocumentByTrackingCode(creditId: string, trackingCode: string): Observable<GetSigningDocumentsItem> {
    return this.getSigningDocumentsListItems(creditId).pipe(
      map((response) => response.documents.find((doc) => doc.trackingCode === trackingCode)),
      switchMap((document) =>
        document ? of(document) : throwError(() => new Error(`Document with tracking code ${trackingCode} not found`)),
      ),
    );
  }

  signDocument(creditId: string, trackingCode: string, password?: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/signing-documents`, {
      creditId,
      trackingCode,
      password,
    });
  }

  revokeCreditDigitalSignature(creditId: string): Observable<any> {
    return this.api.post(`credit/activations/digital-signatures/revoke?creditId=${creditId}`);
  }

  getEarlySettlementDetail(creditId: string): Observable<CreditEarlySettlementDetailResponse> {
    return this.api.get(`credit/early-settlements/detail/${creditId}`);
  }

  getEarlySettlementPayConfig(): Observable<CreditEarlySettlementPayConfigResponse> {
    return this.api.get('credit/early-settlements/pay/config');
  }

  initEarlySettlementPay(creditId: string, amount: number, redirectUrl: string, urlAfterResult: string): Observable<any> {
    return this.api.post('credit/early-settlements/init', {
      creditId,
      amount,
      redirectUrl,
      redirectDetailAfterResult: {
        text: 'تکمیل فرآیند',
        method: 1,
        path: urlAfterResult,
      },
    });
  }

  getNotSwitchTypePossibility(creditId: string): Observable<GetNoteSwitchTypePossibilityResponse> {
    return this.api.get(`credit/activations/e-note/switch-type-possibility/${creditId}`);
  }

  getEnoteStepStatus(creditId: string): Observable<GetEnoteStepStatusResponse> {
    return this.api.get(`credit/activations/e-note/status/${creditId}`);
  }

  getEnoteOnBoardingPage(creditId: string): Observable<GetEnoteOnBoardingPageResponse> {
    return this.api.get(`credit/activations/e-note/on-board/${creditId}`);
  }

  initEnoteStep(creditId: string, iban?: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/e-note/initiate/${creditId}`, {
      iban,
    });
  }

  getEnotePaymentConfig(creditId: string): Observable<GetEnotePaymentConfigResponse> {
    return this.api.get(`credit/activations/e-note/payment/${creditId}`);
  }

  enotePaymentCallBack(creditId: string): Observable<EnotePaymentCallbackResponse> {
    return this.api.post(`credit/activations/e-note/payment/callback/${creditId}`);
  }

  enotePaymentInit(trackingCode: string, redirectUrl: string, urlAfterResult: string): Observable<EnotePaymentInitResponse> {
    return this.api.post('promissory-notes/payments/init', {
      promissoryNoteTrackingCode: trackingCode,
      redirectDetailAfterResult: {
        text: 'ادامه فرآیند',
        method: 1,
        path: urlAfterResult,
      },
      redirectUrl,
    });
  }

  rollbackEnote(endpoint: string, creditId: string): Observable<GenericApiResponse> {
    endpoint = endpoint.replace('{creditId}', creditId);
    return this.api.post(endpoint);
  }

  getPlanGroups(userType: UserType = UserType.APP): Observable<GetPlanGroupsResponse> {
    return this.api.get(`credit/plans`, undefined, new HttpHeaders({ 'User-Type': userType })).pipe(
      map((response) => {
        response.planGroupDetails = response.planGroupDetails.map((item: any) => {
          if (item.serviceType === SERVICE_TYPE.BNPL && item.installmentCount > 1) {
            return {
              ...item,
              installmentCount: item.installmentCount + 1,
            };
          }
          return item;
        });
        if (this.creditServiceTypeService.isBnpl()) {
          response.planGroupDetails = response.planGroupDetails.filter((item: any) => item.fundProvider.fundProviderCode === 7);
        }
        return response;
      }),
    );
  }

  getSmartScorePlans(userType: UserType = UserType.APP): Observable<GetPlanGroupsResponse> {
    return this.api.get(`credit/offer/pre-sign-up/plans`, undefined, new HttpHeaders({ 'User-Type': userType }));
  }

  cancelCreditActivation(
    fundProviderCode: string | number,
    creditId: string,
    cancelReasonType: string,
    cancelReason: string,
  ): Observable<CancelActivationResponse> {
    return this.api.post('credit/activations/cancel', {
      fundProviderCode,
      creditId,
      cancelReasonType,
      cancelReason,
    });
  }

  getCancelCreditActivationReasons(serviceType: string): Observable<CancelActivationReasonsResponse> {
    return this.api.get(`credit/activations/cancel/reasons?serviceType=${serviceType}`);
  }

  getCancelActivationAccess(creditId: string): Observable<CancelActivationAccessResponse> {
    return this.api.get(`credit/activations/archive/access/${creditId}`);
  }

  revertCancelRequest(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/archive/rebound/${creditId}`);
  }

  inquiryUnderwriter(requestData: InquiryUnderwriterRequest): Observable<InquiryUnderwriterResponse> {
    return this.api.post('underwriters/submissions/inquiry', requestData);
  }

  getAccountBlockStepStatus(creditId: string): Observable<AccountBlockStepStatusResponse> {
    return this.api.get(`credit/bank-accounts/block/status/${creditId}`);
  }

  inquiryCheckCreditFile(creditId: string, retry: boolean): Observable<GenericApiResponse> {
    if (retry) {
      return this.retryCheckCreditFile(creditId);
    }
    return this.api.get(`credit/check-credit-file/inquiry/${creditId}`);
  }

  retryCheckCreditFile(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/check-credit-file/retry/${creditId}`);
  }

  getCheckCreditFileStatus(creditId: string): Observable<CheckCreditFileStatusResponse> {
    return this.api.get(`credit/check-credit-file/status/${creditId}`);
  }

  blockAccount(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/bank-accounts/block/${creditId}`);
  }

  retryBlockAccount(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/bank-accounts/block/retry/${creditId}`);
  }

  getInstallmentSellsOnBoarding(creditId: string): Observable<InstallmentSellsOnBoardingResponse> {
    return this.api.get(`credit/installment-cheques/onboard/${creditId}`);
  }

  getInstallmentSellsGuide(creditId: string, chequeOrder: number): Observable<InstallmentSellsGuideResponse> {
    return this.api.get(`credit/installment-cheques/guide/${creditId}/${chequeOrder}`);
  }

  getInstallmentSellsStatus(creditId: string): Observable<InstallmentSellsStatusResponse> {
    return this.api.get(`credit/installment-cheques/status/${creditId}`);
  }

  getInstallmentSellsDetail(creditId: string): Observable<InstallmentSaleDocumentResponse> {
    return this.api.get(`credit/installment-cheques/detail/${creditId}`);
  }

  installmentSellsInit(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/installment-cheques/init/${creditId}`);
  }

  installmentSellsConfirm(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/installment-cheques/confirm/${creditId}`);
  }

  installmentSellsRegistered(creditId: string): Observable<GenericApiResponse> {
    return this.api.post(`credit/installment-cheques/registered/${creditId}`);
  }

  installmentSellsUploadConfirm(creditId: string, chequeOrder: number): Observable<GenericApiResponse> {
    return this.api.post(`credit/installment-cheques/upload/confirm/${creditId}/${chequeOrder}
`);
  }

  installmentSellsGenerate(creditId: string, chequeId: string, chequeOrder: number): Observable<GenericApiResponse> {
    return this.api.post(`credit/installment-cheques/generate/${creditId}`, {
      chequeId,
      order: chequeOrder,
    });
  }

  getInstallmentTicketVersion2(payload: GetTicketVersion2Request, callbackUrl: string) {
    return this.getTicketVersion2(CreditTicketTypes.INSTALLMENTS, {
      ...payload,
      callbackUrl,
    });
  }

  getCartReservation(
    creditId: string,
    reservationType: InstallmentSaleReservationType,
  ): Observable<InstallmentSaleCartReservationResponse> {
    return this.api.get(`credit/cart-reservation/${creditId}/${reservationType}`);
  }

  getCreditStores(restriction: any[] = [], page: number, pageSize: number): Observable<any> {
    const defaultRestrictions = [
      {
        type: RestrictionTypes.SIMPLE,
        field: StoreRestrictionFields.IS_DEACTIVE,
        operation: 'eq',
        value: false,
      },
    ];

    const combinedRestrictions = [...defaultRestrictions, ...restriction];

    return this.api.post(`app/store/stores/search?page=${page}&size=${pageSize}`, {
      restrictions: combinedRestrictions,
      orders: [
        {
          field: 'priority',
          order: 'asc',
        },
      ],
    });
  }

  getCreditStoresWithoutLogin(restriction: any[] = [], page: number, pageSize: number): Observable<any> {
    const defaultRestrictions = [
      {
        type: RestrictionTypes.SIMPLE,
        field: StoreRestrictionFields.IS_DEACTIVE,
        operation: 'eq',
        value: false,
      },
    ];

    const combinedRestrictions = [...defaultRestrictions, ...restriction];

    return this.api.post(`app/store/web/stores/search?page=${page}&size=${pageSize}`, {
      restrictions: combinedRestrictions,
      orders: [
        {
          field: 'priority',
          order: 'asc',
        },
      ],
    });
  }

  getEnoteSelectConfig(creditId: string): Observable<GetEnoteSelectConfigResponse> {
    return this.api.get(`credit/activations/physical-note/select-page/${creditId}`);
  }

  onboardPhysicalNote(creditId: string) {
    const payload: OnboardPhysicalNotePayload = {
      creditId,
    };
    return this.api.post(`credit/activations/physical-note/onboard`, payload);
  }

  initPhysicalNote(payload: InitPhysicalNotePayload): Observable<GenericApiResponse> {
    return this.api.post(`credit/activations/physical-note/init`, payload);
  }

  getPhysicalNoteGuide(creditId: string): Observable<PhysicalNoteGuideResponse> {
    return this.api.get(`credit/activations/physical-note/physical-guide/${creditId}`);
  }

  getPhysicalNoteDetail(creditId: string): Observable<PhysicalNoteDetailResponse> {
    return this.api.get(`credit/activations/physical-note/detail/${creditId}`);
  }

  uploadDocumentPhysicalNote(file: File, creditId: string): Observable<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.multiPartUpload(`credit/activations/physical-note/upload/${creditId}`, formData);
  }

  confirmPhysicalNote(creditId: string) {
    return this.api.post(`credit/activations/physical-note/confirm/${creditId}`);
  }

  getCreditAgreements(creditId: string): Observable<CreditAgreementsResponse> {
    return this.api.get(`credit/agreement/${creditId}`);
  }

  getSubscriptionStatus(creditId: string): Observable<SubscriptionStatusResponse> {
    return this.api.get(`credit/subscription/status/${creditId}`);
  }

  subscriptionInitiate(creditId: string, allocationPaymentMethodType?: ALLOCATION_PAYMENT_METHOD): Observable<GenericApiResponse> {
    return this.api.post(`credit/subscription/initiate/${creditId}`, { allocationPaymentMethodType });
  }

  verifyUser(data: { nationalCode: string; birthDate: string }): Observable<GenericApiResponse> {
    return this.api.post(`credit/users/verify-profile`, data);
  }

  retryPlanServicesApi(serviceType: SERVICE_TYPE_SUBSCRIPTION_ENUM): Observable<GenericApiResponse> {
    return this.api.post(`/app-subscription/purchases/plans/retry/service/${serviceType}`);
  }

  registerBnpl(body: CampaignWalletRequest): Observable<CampaignWalletResponse> {
    return this.api.post('credit/campaigns/create/wallet', body);
  }

  getTotalInstallments(): Observable<TotalInstallmentsResponse> {
    return this.api.get('contracts/installments?serviceType=0&rfr=App');
  }

  private getTicketVersion2(ticketType: CreditTicketTypes, payload: any): Observable<TicketVersion2Response> {
    return this.api.post(`tickets?type=${ticketType}`, payload);
  }

  /**
   * Transform steps and make them compatible with the UI
   */
  private transformStep(step: Step) {
    step.statusText = STEP_STATUSES[step.status];
    step.typeText = STEP_TYPES[step.stepType];
    step.stepTagText = STEP_TAGS[step.stepTag];
    step.kind = transformStepCodeToText(step.code);
    step.open = false;

    switch (step.statusText) {
      case 'INITIATE':
        step.state = step.active ? 'ACTIVE' : 'DISABLED';
        break;
      case 'INPROGRESS':
        step.state = step.active ? 'ACTIVE' : 'DISABLED';
        step.open = true;
        break;
      case 'COMPLETED':
      case 'OPERATIONAL_ACCEPTANCE':
        step.state = 'SUCCESS';
        break;
      case 'OPERATIONAL_REJECTION':
        step.state = 'WARNING';
        step.open = true;
        break;
      case 'FAILED':
        step.state = 'ERROR';
        step.open = true;
        break;
      default:
        step.state = '';
        break;
    }

    return step;
  }
}
