import { Agent } from './agent.model';

export interface User {
  guid: string;
  token: string;
  active: boolean;
  agent: Agent;
  isSejami: boolean;
  creationTime: number;
  nationalCode: string;
  mobileNumber: string;
  isRegistered: boolean;
  registeredInFund: boolean;
  mobileNumberVerified: boolean;
  //Will be changed
  customerInfo: any;
}
