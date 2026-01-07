import {BadgeAlertInterface} from "../components/badge-alert/badge-alert.interface";

export const EXIT_ALERT_DATA: BadgeAlertInterface = {
  description: 'آیا مایل به انصراف از پرداخت هستید؟',
  submitButtonText: 'انصراف از پرداخت',
  cancellationButtonText: 'ادامه پرداخت',
  logoPath: 'assets/image/shape-exit.svg',
  customLogoStyle: {
    width: '126px',
    height: '94px',
    margin: '8px 0 32px 0'
  },
  customDescriptionStyle: {
    'text-align': 'center'
  },
  appearance: 'red-text'
};
