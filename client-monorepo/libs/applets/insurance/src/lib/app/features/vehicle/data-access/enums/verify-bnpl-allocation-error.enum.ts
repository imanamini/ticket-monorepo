export enum VerifyBnplAllocationErrorEnum {
  PartyNationalCodeIsNotVerified = 'PartyNationalCodeIsNotVerified',
  PartyBirthDateIsNotVerified = 'PartyBirthDateIsNotVerified',
  KycShahkarFailed = 'KycShahkarFailed',
  SmcScoreConfigFailed = 'SmcScoreConfigFailed',
}

export const VERIFY_BNPL_ALLOCATION_ERROR_ENUM_TRANSLATOR = {
  [VerifyBnplAllocationErrorEnum.PartyNationalCodeIsNotVerified]: 'تطابق کد ملی و موبایل',
  [VerifyBnplAllocationErrorEnum.PartyBirthDateIsNotVerified]: 'تطابق کد ملی و تاریخ تولد',
  [VerifyBnplAllocationErrorEnum.KycShahkarFailed]: 'سرویس دهنده در دسترس نمی باشد',
  [VerifyBnplAllocationErrorEnum.SmcScoreConfigFailed]: 'سرویس دهنده در دسترس نمی باشد',
};