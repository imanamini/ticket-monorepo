import { C2cFrequentTransaction } from '../data-access/models/c2c-frequent-transaction-response';

export function extractC2cFrequentTransaction(item: C2cFrequentTransaction) {
  let amount = '';
  let iconId = '';
  let sourceIndex = '';
  let destinationIndex = '';

  item.info?.forEach((i) => {
    if (i.label === 'amount') {
      amount = i.value;
    }

    if (i.label === 'iconId') {
      iconId = i.value;
    }

    if (i.label === 'sourceIndex') {
      sourceIndex = i.value;
    }

    if (i.label === 'destinationIndex') {
      destinationIndex = i.value;
    }
  });

  return { amount, iconId, sourceIndex, destinationIndex };
}
