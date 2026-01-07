import { Injectable, signal, WritableSignal } from '@angular/core';
import { SetOfObjects } from '@client-monorepo/common/utilities';
import { TransactionSearchPayloadRestrictionItemInterface } from '@client-monorepo/payment/transactions';

@Injectable({
  providedIn: 'root',
})
export class TransactionsSearchService {
  restrictions: WritableSignal<SetOfObjects<TransactionSearchPayloadRestrictionItemInterface>> = signal(
    new SetOfObjects<TransactionSearchPayloadRestrictionItemInterface>((restriction) => restriction?.field ?? ''),
  );
}
