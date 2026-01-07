export interface HomeNotification {
  actionType: number;
  buttonText: string;
  message: string;
  payload: {
    url: string;
  };
  result: object;
  title: string;
  uid: string;
}
