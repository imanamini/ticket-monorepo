import { GenericApiResponse } from '../models/generic-api-response.model';

export interface UserProfileResponse extends GenericApiResponse {
  userDetail: UserDetail;
}

export interface UserDetail {
  userId: string;
  name?: string;
  surname?: string;
  cellNumber: string;
  nationalCode?: string;
  email?: Email;
  imageId?: string;
  phone?: Phone;
  active: boolean;
  birthDate?: number;
  gender?: number;
}

export interface Email {
  email: string;
  status: number;
}

export interface Phone {
  number: string;
  status: number;
}
