import { GenericApiResponse } from '@client-monorepo/common/network';
import { FinePlate } from './fine-plate';

export interface GetFinePlateResponse extends GenericApiResponse {
  plates: FinePlate[];
}
