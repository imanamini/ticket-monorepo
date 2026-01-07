import {ActivityInfo} from "../../../models/cash-out.model";

export interface ReceiptInterface {
  'status': string,
  'color': number,
  'imageId': string,
  'title': string
  'amount': number,
  'paymentResult': ActivityInfo[],
  redirectUrl?: string;
  'trackingCode': string,
  'description': string,
}
