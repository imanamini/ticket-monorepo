export enum EVerifyCustomerState {
  /**
   * Go to natinoal Id page -- Shahkar
   */
  RequiresNationalId = 'RequiresNationalId',

  /**
   * go to OTP page
   */
  RequiresOtp = 'RequiresOtp',

  /**
   * go to aggriment page
   */
  RequiresAgreement = 'RequiresAgreement',

  /**
   * Continue to next page
   */
  Verified = 'Verified',
}
