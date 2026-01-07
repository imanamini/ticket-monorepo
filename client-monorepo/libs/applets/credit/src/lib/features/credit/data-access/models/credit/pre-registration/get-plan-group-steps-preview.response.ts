import { GenericApiResponse } from '../../generic-api-response.model';

export interface GetPlanGroupStepsPreviewResponse extends GenericApiResponse {
  stepDtoList: { code: number; title: string; option: number }[];
}
