import { TicketType } from '../credit/api/purchase/ticket-type.model';
import { ServiceType } from '../credit/core/models/serviceType.model';

export const TicketServiceMapper = {
  [TicketType.BNPL]: ServiceType.BNPL,
  [TicketType.CREDIT]: ServiceType.CREDIT,
  [TicketType.CREDIT_CARD]: ServiceType.CREDIT,
  [TicketType.INSTALLMENT_SALE]: ServiceType.INSTALLMENT_SALE,
};
