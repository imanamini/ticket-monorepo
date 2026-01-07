import { GenericApiResponse } from '../../generic-api-response.model';
import { ShowCreditScoreModel } from '../../../../wallet-activation/show-credit-score/show-credit-score.model';
import { convertDecimalToRgb, convertDecimalToRgba } from '../../../utils/colors';
import { VerifyOtpResponse } from './verify-otp-response.model';

export interface CreditScore extends GenericApiResponse {
  score: number;
  fundProviderCode: number;
  minScore: number;
  maxScore: number;
  acceptableScore: number;
  UnAcceptableScore: number;
  color: number;
  compute: boolean;
  active: boolean;
  image: string;

  actionText: string;
  unAcceptableScore: number;
  validityText: string;

  scoreResult: string;
  trackingCode: string;

  // local, not in API
  title: string;
}

export const transformCreditScoreToShowModel = (score: CreditScore | VerifyOtpResponse) => {
  const range = score.maxScore - score.minScore;
  const s = score.score - score.minScore;
  const percent = (s * 100) / range;

  return {
    circle: {
      percent,
      subtitle: 'از ' + score.maxScore,
      icon: score.acceptableScore <= score.score ? 'success' : 'warning',
      imageId: score.image || null,
      fillColor: convertDecimalToRgba(score.color, 0.3),
      color: convertDecimalToRgb(score.color),
      score: score.scoreResult,
    },
    button: {
      text: 'ادامه',
    },
    // TODO: check these !?!?
    title: score.title || '',
    level: score.actionText || '',
    description: score.validityText,
  } as ShowCreditScoreModel;
};
