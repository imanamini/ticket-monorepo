export class UserLoginActivityModel {
  date: string;
  items: UserLoginActivityItemModel[];
}

class UserLoginActivityItemModel {
  ipAddress: string;
  firstActivityAt: string;
  lastActivityAt: string;
}
