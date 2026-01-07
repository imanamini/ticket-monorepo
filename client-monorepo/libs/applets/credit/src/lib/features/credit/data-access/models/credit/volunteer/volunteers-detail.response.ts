import { GenericApiResponse } from '../../generic-api-response.model';

export interface VolunteerField {
  name: 'birthDate' | 'nationalCode';
  editable: boolean;
  value?: string | number;
}

export interface VolunteersDetailResponse extends GenericApiResponse {
  cellNumber: string;
  fields: VolunteerField[];
}
