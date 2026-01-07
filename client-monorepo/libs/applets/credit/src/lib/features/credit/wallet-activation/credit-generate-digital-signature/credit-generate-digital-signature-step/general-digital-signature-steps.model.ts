import {
  GenerateDigitalSignatureStepStatus
} from '../../../data-access/models/credit/activation/generate-digital-signature-step/generate-digital-signature-step-status';

export const DigitalSignatureStepperUrl = '/wallet/activation/generate-digital-sign-contract/v2/';

export enum STEPS {
  INFO_FORM = 'info-form',
  GENERATE_SIGNATURE = 'generate-signature',
  TAKE_PHOTO = 'take-photo',
  TAKE_VIDEO = 'take-video',
  GENERATE_PASSWORD = 'generate-signature-password',
}

export enum RESPONSE_ERROR_TYPE {
  VIDEO_ERROR = 1,
  PHOTO_ERROR = 2,
  PHOTO_COMPARE_ERROR = 3,
  VIDEO_SIZE_ERROR = 4,
}

export enum RESPONSE_ERROR_STATUS {
  LIVENESS_WRONG_BIRTHDATE_OR_NATIONAL_SERIAL = 18217,
  LIVENESS_PROVIDER_IMAGE_DOES_NOT_MATCH = 18216,
  DIGITAL_SIGNATURE_ATTEMPT_FAILED = 5359,
  NATIVE_LIVENESS_MAX_TRY = 5358,
}

export const GeneralDigitalSignatureSteps = [
  {
    status: GenerateDigitalSignatureStepStatus.ONBOARDED,
    title: 'تکمیل اطلاعات',
    icon: 'docuemnt-file',
    url: STEPS.INFO_FORM,
  },
  {
    status: GenerateDigitalSignatureStepStatus.REGISTERED,
    title: 'ثبت امضا',
    icon: 'signature',
    url: STEPS.GENERATE_SIGNATURE,
  },
  {
    status: GenerateDigitalSignatureStepStatus.IMAGE_UPLOADED,
    title: 'ثبت عکس',
    icon: 'camera',
    url: STEPS.TAKE_PHOTO,
  },
  {
    status: GenerateDigitalSignatureStepStatus.SELFIE_UPLOADED,
    title: 'ضبط ویدئو',
    icon: 'traffic-camera',
    url: STEPS.TAKE_VIDEO,
  },
  {
    status: GenerateDigitalSignatureStepStatus.VIDEO_UPLOADED,
    title: 'رمز امضای دیجیتال',
    icon: 'lock',
    url: STEPS.GENERATE_PASSWORD,
  },
];
