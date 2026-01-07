import { CreditSmartScoringStatus } from '../../../credit-smart-scoring/services/credit-smart-scoring.status';
import { GenericApiResponse } from '../generic-api-response.model';
import { SMART_SCORING_STATUS_CODE } from '../../../credit-smart-scoring/services/credit-smart-scoring-step-status';
import { CreditSmartScoringOngoingPlan } from './credit-smart-scoring-ongoing.plan';

export interface CreditSmartScoringConfigResponse extends GenericApiResponse {
  userId: string;
  cellNumber: string;
  nationalCode: string;
  dpScore: string;
  merit: string;
  eNoteStatus: string;
  chequeStatus: string;
  whiteListResponse: WHITE_LIST_RESPONSE;
  icsTrackingCode: string;
  icsScore: string;
  scoreDeterminer: 'LOC' | 'MATRIX' | 'DP_SCORE';
  dpScoreResult: string;
  locCheque: number;
  locPromissoryNote: number;
  isInBlackList: boolean;
  creationDate: number;
  expirationDate: number;
  modificationDate: number;
  status: CreditSmartScoringStatus;
  failedReasonCode: SMART_SCORING_STATUS_CODE;
  ongoingPlanDetails: CreditSmartScoringOngoingPlan;
  hasPreSignUp: boolean;
}

export enum WHITE_LIST_RESPONSE {
  IN_BLACK_LIST = -2,
  DP_FAILED = -1,
  DP_PASSED = 0,
  WHITE_LIST = 1,
}
