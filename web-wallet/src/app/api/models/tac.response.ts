import { GenericResponse } from './generic.response';

export interface TacFeature {
  title: string;
  isProtected: number;
  editable: boolean;
  url: string;
  // LOCAL PROPERTY, NOT IN THE API
  originalUrl: string;
}

interface NameDto {
  name: string;
  surname: string;
}

export interface UserDetail {
  userId: string;
  cellNumber: string;
  active: boolean;
  jobTitle: string;
  zoneId: string;
  name: NameDto;
  englishName: NameDto;
  fatherName: NameDto;
  englishFatherName: NameDto;
}

export interface TacResponse extends GenericResponse {
  shouldAcceptTac: boolean;
  tacUrl: string;
  defaultGateway: number;
  userDetail: UserDetail;
  gateways: Array<number>;
  features: {
    [key: string]: TacFeature
  };
}
