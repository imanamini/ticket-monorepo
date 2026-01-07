export interface OtpComponentProps {
  title: string;
  phoneNumber: string;
}
export type OtpSheetResult = { type: 'cancel' } | { type: 'resend' } | { type: 'submit'; code: string };
