export interface IdentityInfo {
  shahkarStatus: boolean;
  sabteAhval: {
    birthDateStatus: boolean;
    deathStatus: boolean;
  };
  user: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
}
