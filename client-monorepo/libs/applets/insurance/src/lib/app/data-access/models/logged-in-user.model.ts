import { Email, Phone } from './tac.model';

export interface LoggedInUser {
  userId: string;
  name: string;
  surname: string;
  cellNumber: string;
  nationalCode: string;
  email: Email;
  imageId: string;
  phone: Phone;
  active: boolean;
  birthDate: number;
  gender: number;
}
