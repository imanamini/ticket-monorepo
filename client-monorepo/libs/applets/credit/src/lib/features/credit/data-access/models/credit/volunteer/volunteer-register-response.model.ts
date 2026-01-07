import { GenericApiResponse } from '../../generic-api-response.model';

export interface VolunteerRegisterResponse extends GenericApiResponse {
  volunteersNumber: number;
}
