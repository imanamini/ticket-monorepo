export interface PinConfigInterface {
  newPasswordType?: boolean;
  forgotPassword?: boolean;
  type?: boolean;
  phoneNumber?: string;
  isOverlay?: boolean;
  isBackActionHidden?: boolean;
  isCallTac?: boolean;
  resetPinCallbackUrl?: string;
  isInPage?: boolean;
  features?: number[];
  requestHeaders?: Record<string, string>;
  hasBackground?: boolean;
  isPayType?: boolean;
  isBiometricType?: boolean;
}
