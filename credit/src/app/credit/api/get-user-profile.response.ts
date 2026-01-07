export interface GetUserProfileResponse {
  userDetail: {
    active: boolean;
    businesses: any[];
    cellNumber: string;
    email: any;
    surname: string;
    userId: string;
    zoneId: string;
  };
}
