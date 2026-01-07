import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { DigiCardActivationApiInput } from '../models/digi-card-activation.interface';
import { DigiCardSharedService } from './digi-card-shared.service';

@Injectable()
export class DigiCardActivateService {
  digiCardSharedService = inject(DigiCardSharedService);
  private apiService = inject(ApiService);

  activateCard(entity: DigiCardActivationApiInput): Observable<ApiResultInterface> {
    return this.apiService.call<ApiResultInterface>(new RequestBuilder(RequestTypeEnum.POST, '/digicard/cards/activate', entity));
  }
}
