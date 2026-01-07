import { TicketType } from '../emuns/ticket-type.emun';
import { TgsUserType } from '../emuns/tgs-user-type.emun';

export interface TgsGetTicketBody {
  type: TicketType;
  cellNumber: string;
  amount?: number;
  providerId: string;
  callbackUrl: string;
  additionalInfo?: {
    userType?: TgsUserType,
    preferredGateway?:string,
    basketDetailsDto?:any
  };
}
