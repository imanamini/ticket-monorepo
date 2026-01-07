import { inject, Injectable } from '@angular/core';
import { PolicyCardService } from './policy-card.service';
import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../../../data-access/enums/vehicle-policy-state.enum';
import {
  ThirdPartyKeysEnum
} from '../../../../../../../vehicle/features/third-party/data-access/enums/third-party-keys.enum';
import { InsuranceKeysEnum } from '../../../../../../../../data-access/enums/insurance-keys.enum';
import { InsuranceTabEnum } from '../../../../../../data-access/enums/policy-list.enum';
import { Router } from '@angular/router';
import { PaymentRequestTypeEnum } from '../../../../../../../vehicle/data-access/enums/payment-request-type.enum';
import {
  ApplicationFormPaymentService
} from '../../../../../../../vehicle/features/third-party/features/order/data-access/services/application-form-payment.service';
import { PolicyApiService } from '../../../../../../../vehicle/data-access/services/third-party/policy-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyCardThirdPartyMotorService extends PolicyCardService {
  private router = inject(Router);
  private paymentService = inject(ApplicationFormPaymentService);
  private apiService = inject(PolicyApiService);
  private messageService = inject(MessageService);

  handleButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean> {
    return new Promise(resolve => {
      switch (data.state) {
        case VEHICLE_POLICY_STATE_ENUM.REFUSED:
        case VEHICLE_POLICY_STATE_ENUM.EXPIRING:
        case VEHICLE_POLICY_STATE_ENUM.CANCELLED:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}`]);
          resolve(true);
          break;
        case VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING:
          this.paymentService.postPaymentRequest(data.id as string, PaymentRequestTypeEnum.CONFLICT);
          resolve(true);
          break;
        case VEHICLE_POLICY_STATE_ENUM.DOCUMENTS_CONFLICT_RESOLVE_PENDING:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/order-state`], {
            queryParams: {
              [ThirdPartyKeysEnum.FormId]: data.id
            }
          });
          resolve(true);
          break;
        case VEHICLE_POLICY_STATE_ENUM.ISSUED:
          const uniqueCode = data.id as string;
          this.apiService.downloadPolicyThirdpartyMotor(uniqueCode).subscribe({
            next: data => {
              let popUp: WindowProxy | null;
              popUp = window.open(data.result.url, '_blank');
              try {
                popUp.focus();
              } catch (e) {
                window.location.assign(data.result.url);
              }
              this.messageService.showSuccessMessage('بیمه‌نامه با موفقیت دانلود شد.');
              resolve(true);
            },
            error: _ => {
              resolve(false);
            }
          });
          break;
        case VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/verify-postal-code`], {
            queryParams: {
              [ThirdPartyKeysEnum.FormId]: data.id
            }
          });
          resolve(true);
          break;
        default:
          this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/order-state`], {
            queryParams: {
              [ThirdPartyKeysEnum.FormId]: data.id
            }
          }).then();
          resolve(true);
      }

    });
  }

  handleDetailButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyDetail}`], {
      queryParams: {
        [ThirdPartyKeysEnum.FormId]: data.id,
        [InsuranceKeysEnum.POLICY_TYPE]: InsuranceTabEnum.THIRD_PARTY_MOTOR
      }
    });
  }

  getActionButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    switch (data.state) {
      case VEHICLE_POLICY_STATE_ENUM.CANCELLED:
      case VEHICLE_POLICY_STATE_ENUM.REFUSED:
        return 'خرید مجدد';
      case VEHICLE_POLICY_STATE_ENUM.ISSUED:
        return 'دانلود بیمه‌نامه';
      case VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING:
        return 'تایید و پرداخت';
      case VEHICLE_POLICY_STATE_ENUM.DOCUMENTS_CONFLICT_RESOLVE_PENDING:
        return 'بارگذاری مدارک';
      case VEHICLE_POLICY_STATE_ENUM.EXPIRING:
        return 'تمدید';
      case VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION:
        return 'تایید کد پستی';
      default:
        return 'ادامه فرآیند';
    }
  }

  getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return 'جزییات';
  }

  showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return data.state !== VEHICLE_POLICY_STATE_ENUM.EXPIRED &&
      data.state !== VEHICLE_POLICY_STATE_ENUM.ISSUING &&
      data.state !== VEHICLE_POLICY_STATE_ENUM.VERIFY_ADDRESS_REGISTRATION;
  }

  showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return true;
  }

  getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): { name: string; type: string } | null {
    return data.state === VEHICLE_POLICY_STATE_ENUM.ISSUED ? {
      name: 'download',
      type: 'linear'
    } : null;
  }

  isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }

}
