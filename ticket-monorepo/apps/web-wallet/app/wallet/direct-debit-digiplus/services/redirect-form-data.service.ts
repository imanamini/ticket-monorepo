import { Injectable } from '@angular/core';
import { RedirectFormData } from '../../../core/services/redirect.service';
import { STATUS } from '../../direct-debit/direct-debit-result/interfaces/direct-debit-result-data.interface';

export type RedirectStatus = 'CANCEL_BY_USER' | 'FAILED' | 'SUCCESS' | 'UNKNOWN';

@Injectable({
  providedIn: 'root'
})
export class RedirectFormDataService {

  public get(contractInfoId: string, decodedDataStatus: STATUS, providerId: string): Array<RedirectFormData> {
    const redirectPayloadArray: Array<RedirectFormData> = [];
    redirectPayloadArray.push({key: 'contractId', value: contractInfoId});
    redirectPayloadArray.push(RedirectFormDataService.setStateFormDataBasedOnState(decodedDataStatus));
    if (providerId) {
      redirectPayloadArray.push({key: 'providerId', value: providerId});
    }
    return redirectPayloadArray;
  }

  private static setStateFormDataBasedOnState(decodedDataStatus: STATUS): RedirectFormData {
    return {
      key: 'status',
      value: RedirectFormDataService.statusMapper(decodedDataStatus)
    };
  }

  private static statusMapper(status: STATUS): RedirectStatus {
    switch (status) {
      case 'FAILED':
        return 'FAILED';

      case 'CANCELED':
        return 'CANCEL_BY_USER';

      case 'SUCCESS':
        return 'SUCCESS';

      default:
        break;
    }

  }
}
