import { GenericApiResponse } from '../../generic-api-response.model';
import { Education } from './education.model';

export interface EducationsResponse extends GenericApiResponse {
  educations: Array<Education>;
}
