import { Injectable } from '@angular/core';
import { RedirectFormData } from '../../../core/services/redirect.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectDataFactory {

  public failureFormData(providerId: string): RedirectFormData[] {
    const data = [
      {
        key: 'status',
        value: 'FAILURE'
      },
    ];
    if (providerId) {
      data.push({
        key: 'providerId',
        value: providerId
      });
    }
    return data;
  }

  public unknownFormData(providerId: string): RedirectFormData[] {
    const data = [
      {
        key: 'status',
        value: 'UNKNOWN'
      },
    ];
    if (providerId) {
      data.push({
        key: 'providerId',
        value: providerId
      });
    }
    return data;
  }

  public successFormData(providerId: string): RedirectFormData[] {
    const data = [
      {
        key: 'status',
        value: 'SUCCESS'
      },
    ];
    if (providerId) {
      data.push({
        key: 'providerId',
        value: providerId
      });
    }
    return data;
  }

  public cancelByUserFormData(providerId: string): RedirectFormData[] {
    const data = [
      {
        key: 'status',
        value: 'CANCEL_BY_USER'
      },
    ];
    if (providerId) {
      data.push({
        key: 'providerId',
        value: providerId
      });
    }
    return data;
  }
}
