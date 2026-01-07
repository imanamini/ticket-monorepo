import { ApiResultInterface } from '@client-monorepo/common/network';
import { DigiCardIssuanceStatus, DigiCardIssuanceStep } from './digi-card-issuance.enum';

export interface IssuanceDetail {
  status: DigiCardIssuanceStatus;
  currentStep: DigiCardIssuanceStep;
  nextStep: DigiCardIssuanceStep;
}
export interface DigiCardIssuanceResponse extends IssuanceDetail, UserIdentity {
  result: ApiResultInterface;
}
export interface DigiCardIssuanceInitResponse {
  result: ApiResultInterface;
}
export interface UserIdentity {
  name: string;
  birthDate: number;
  deathStatus: DeathStatus;
  nationalCode: string;
  address: string;
  postalCode: string;
}
export interface UserIdentityViewModel extends Omit<UserIdentity, 'birthDate'> {
  birthDate: Date;
}
export interface UserIdentityResponse extends UserIdentity {
  result: ApiResultInterface;
}
export enum DeathStatus {
  alive,
  death,
}
export interface IdentityInput {
  postalCode: string;
  birthDate: number;
}
export interface confirmPlanResponse {
  result: ApiResultInterface;
}
