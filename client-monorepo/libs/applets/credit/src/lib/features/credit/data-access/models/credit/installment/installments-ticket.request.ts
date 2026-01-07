import { AggregationInstallmentFields } from './installment';

export interface GetTicketRequest {
  ticketRequestDetails: AggregationInstallmentFields[];
}

export interface GetTicketVersion2Request {
  aggregateTicketDto: GetTicketRequest;
  amount: number;
}
