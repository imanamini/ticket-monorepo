export interface PasswordInfo {
  value: string;
  isPasswordVisible?: boolean;
  passwordStrengthText?: string;
  passwordStrengthColor?: string;
  complexityLevel?: number;
  isPlaceHolderVisible?: boolean;
  placeHolder: string;
  hasStrength?: boolean;
  errorMessage?: string;
  rules?: passwordInfoRules;
}

export interface passwordInfoRules {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  symbol: boolean;
}
