import { ApiResultInterface } from '@client-monorepo/common/network';
import { CardStatus } from './digipay-card-status.enum';

export interface DigipayCardListResponse {
  cardResults: DigipayCard[];
  result: ApiResultInterface;
}

export interface DigipayCard {
  maskedPan: string;

  maskedCellNumber: string;

  maskedNationalCode: string;

  expirationDate: string;

  templateCode: string;

  fullName: string;

  status: CardStatus;

  isUserCardOwner: boolean;

  uniqueId: number;

  balance: number;
}
