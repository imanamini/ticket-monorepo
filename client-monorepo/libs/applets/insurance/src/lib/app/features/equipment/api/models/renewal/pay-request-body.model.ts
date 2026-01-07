export interface PayRequestBodyModel {
  code?: string;
  step?: number;
  isRequestedByDesktop?: boolean;
  isHybrid: boolean;
  referer?: string;
}
