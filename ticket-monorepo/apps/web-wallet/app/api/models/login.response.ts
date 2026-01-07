import { GenericResponse } from './generic.response';

export interface LoginResponse extends GenericResponse {
  expireIn: number;
  userId: string;
}
