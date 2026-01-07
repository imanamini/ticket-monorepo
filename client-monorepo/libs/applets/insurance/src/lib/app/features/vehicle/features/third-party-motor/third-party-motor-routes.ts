import { Routes } from '@angular/router';
import { THIRD_PARTY_MOTOR_ROUTE } from './data-access/constants/third-party-motor-route.const';
import { MotorThirdPartyPageTitleEnum } from '../../../../data-access/enums/motor-third-party-page-title.enum';
import { retryImport } from '../../../../util/retry-import-handler';

export const THIRD_PARTY_MOTOR: Routes = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./third-party-motor.component'), 3, 500).then(m => m.ThirdPartyMotorComponent),
    children: [
      {
        path: '',
        loadComponent: () => retryImport(() => import('./features/model-motorcycle/model-motorcycle.component'), 3, 500).then(m => m.ModelMotorcycleComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.MODEL_BUILD_YEAR,
          stepper: {
            title: 'مشخصات موتور سیکلت',
            stepName: 'مرحله اول',
            currentStep: 1,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotor,
        loadComponent: () => retryImport(() => import('./features/ex-insurer-motor/ex-insurer-motor.component'), 3, 500).then(m => m.ExInsurerMotorComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.ExInsurerMotor,
          stepper: {
            title: 'مشخصات بیمه‌نامه',
            stepName: 'مرحله دوم',
            currentStep: 2,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotorDate,
        loadComponent: () =>
          retryImport(() => import('./features/ex-insurer-motor-date/ex-insurer-motor-date.component'), 3, 500).then(m => m.ExInsurerMotorDateComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.ExInsurerMotorDate,
          stepper: {
            title: 'مشخصات بیمه‌نامه',
            stepName: 'مرحله دوم',
            currentStep: 2,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.ExInsurerMotorInfo,
        loadComponent: () =>
          retryImport(() => import('./features/ex-insurer-motor-info/ex-insurer-motor-info.component'), 3, 500).then(m => m.ExInsurerMotorInfoComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.ExInsurerMotorInfo,
          stepper: {
            title: 'تخفیف و خسارت بیمه‌نامه',
            stepName: 'مرحله سوم',
            currentStep: 3,
            totalSteps: 4,
            backgroundGray: false,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.PriceCardList,
        loadComponent: () =>
          retryImport(() => import('./features/motor-price-card-list/motor-price-card-list.component'), 3, 500).then(m => m.MotorPriceCardListComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.PriceCardList,
          stepper: {
            title: 'انتخاب بیمه',
            stepName: 'مرحله چهارم',
            currentStep: 4,
            totalSteps: 5,
            backgroundGray: true,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.GoToCheckout,
        loadComponent: () =>
          retryImport(() => import('./features/go-to-checkout/go-to-checkout.component'), 3, 500).then(m => m.GoToCheckoutComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.GoToCheckout,
          stepper: {
            isShowHeader: false
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.Checkout,
        loadComponent: () =>
          retryImport(() => import('./features/motor-checkout/motor-checkout.component'), 3, 500).then(m => m.MotorCheckoutComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.Checkout,
          stepper: {
            title: 'انتخاب روش پرداخت',
            stepName: 'مرحله دوم',
            currentStep: 2,
            totalSteps: 3,
            backgroundGray: true,
            isShowHeader: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.Payment,
        loadChildren: () => retryImport(() => import('./features/motor-payment/motor-payment-routes'), 3, 500).then(m => m.MOTOR_PAYMENT_ROUTES),
        data: {
          title: MotorThirdPartyPageTitleEnum.Payment,
          stepper: {
            isShowHeader: true,
            isShowStepper: false
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.UserInfo,
        loadComponent: () =>
          retryImport(() => import('./features/motor-user-info/motor-user-info.component'), 3, 500).then(m => m.MotorUserInfoComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.UserInfo,
          stepper: {
            title: 'تکمیل اطلاعات',
            stepName: 'مرحله دوم',
            currentStep: 3,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true,
            isShowStepper: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.UserAddress,
        loadComponent: () =>
          retryImport(() => import('./features/motor-user-address/motor-user-address.component'), 3, 500).then(m => m.MotorUserAddressComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.UserAddress,
          stepper: {
            title: 'تکمیل اطلاعات',
            stepName: 'مرحله دوم',
            currentStep: 3,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true,
            isShowStepper: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.UploadDocument,
        loadComponent: () =>
          retryImport(() => import('./features/motor-upload-document/motor-upload-document.component'), 3, 500).then(m => m.MotorUploadDocumentComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.UploadDocument,
          stepper: {
            title: 'تکمیل اطلاعات',
            stepName: 'مرحله دوم',
            currentStep: 3,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true,
            isShowStepper: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.GetPolicyMethod,
        loadComponent: () =>
          retryImport(() => import('./features/motor-get-policy-method/motor-get-policy-method.component'), 3, 500).then(m => m.MotorGetPolicyMethodComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.GetPolicyMethod,
          stepper: {
            title: 'تکمیل اطلاعات',
            stepName: 'مرحله دوم',
            currentStep: 3,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true,
            isShowStepper: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.CompleteOrder,
        loadComponent: () =>
          retryImport(() => import('./features/motor-complete-order/motor-complete-order.component'), 3, 500).then(m => m.MotorCompleteOrderComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.CompleteOrder,
          stepper: {
            isShowHeader: false,
            isShowStepper: false
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.OrderState,
        loadComponent: () =>
          retryImport(() => import('./features/motor-order-state/motor-order-state.component'), 3, 500).then(m => m.MotorOrderStateComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.OrderState,
          stepper: {
            isShowHeader: false,
            isShowStepper: false
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.AdditionalUploadDocument,
        loadComponent: () => retryImport(() => import('./features/motor-additional-upload-document/motor-additional-upload-document.component'), 3, 500)
          .then(m => m.MotorAdditionalUploadDocumentComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.AdditionalUploadDocument,
          stepper: {
            title: 'تکمیل اطلاعات',
            stepName: 'مرحله دوم',
            currentStep: 3,
            totalSteps: 3,
            backgroundGray: false,
            isShowHeader: true,
            isShowStepper: true
          }
        }
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTE.VerifyPostalCode,
        loadComponent: () => retryImport(() => import('./features/motor-verify-postal-code/motor-verify-postal-code.component'), 3, 500)
          .then(m => m.MotorVerifyPostalCodeComponent),
        data: {
          title: MotorThirdPartyPageTitleEnum.AdditionalUploadDocument,
          stepper: {
            isShowStepper: false
          }
        }
      }
    ]
  },
];
