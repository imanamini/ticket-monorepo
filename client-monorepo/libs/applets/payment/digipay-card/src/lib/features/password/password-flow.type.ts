export type PasswordMode = 'change' | 'forgot';
export type PasswordType = 'pin' | 'static';

export type PasswordFlowConfig = {
  title: string;
  length: number; // 4 or 6
  showOldPassword: boolean;
  showCvv2: boolean;
  submitCta: string;
  labels: {
    newPassword?: string;
    oldPassword?: string;
    confirmedNewPassword: string;
    cvv2?: string;
  };
  errorMessageMapper: {
    minlength: string;
    maxlength: string;
    pattern?: string;
  };
};

type PasswordFlowConfigBase = Omit<PasswordFlowConfig, 'length' | 'errorMessageMapper'>;

const CONFIG_BASE: Record<PasswordMode, Record<PasswordType, PasswordFlowConfigBase>> = {
  change: {
    pin: {
      title: 'تغییر رمز اول دیجی‌کارت',
      showOldPassword: true,
      showCvv2: false,
      submitCta: 'تغییر رمز',
      labels: {
        oldPassword: 'رمز فعلی',
        newPassword: 'رمز جدید',
        confirmedNewPassword: 'تکرار رمز جدید',
      },
    },
    static: {
      title: 'تغییر رمز خرید آنلاین دیجی‌کارت',
      showOldPassword: true,
      showCvv2: false,
      submitCta: 'تغییر رمز',
      labels: {
        oldPassword: 'رمز فعلی',
        newPassword: 'رمز جدید',
        confirmedNewPassword: 'تکرار رمز جدید',
      },
    },
  },
  forgot: {
    pin: {
      title: 'فراموشی رمز اول دیجی‌کارت',
      showOldPassword: false,
      showCvv2: true,
      submitCta: 'ادامه',
      labels: {
        cvv2: 'CVV2',
        newPassword: 'رمز جدید',
        confirmedNewPassword: 'تکرار رمز جدید',
      },
    },
    static: {
      title: 'فراموشی رمز خرید آنلاین دیجی‌کارت',
      showOldPassword: false,
      showCvv2: true,
      submitCta: 'ادامه',
      labels: {
        cvv2: 'CVV2',
        newPassword: 'رمز جدید خرید آنلاین',
        confirmedNewPassword: 'تکرار رمز جدید',
      },
    },
  },
};

function passwordLength(type: PasswordType): number {
  return type === 'static' ? 6 : 4;
}

function errorMapper(length: number) {
  const msg = `رمز باید ${length} رقم باشد`;
  return { minlength: msg, maxlength: msg, pattern: msg };
}

export function buildPasswordConfig(mode: PasswordMode, type: PasswordType): PasswordFlowConfig {
  const length = passwordLength(type);

  return {
    ...CONFIG_BASE[mode][type],
    length,
    errorMessageMapper: errorMapper(length),
  };
}
