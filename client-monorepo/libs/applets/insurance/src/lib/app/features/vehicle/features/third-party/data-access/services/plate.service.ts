import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { EnterPlateDataModel } from '../../components/enter-plate/models/enter-plate-data.model';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { ThirdPartyKeysEnum } from '../enums/third-party-keys.enum';

@Injectable({
  providedIn: 'root'
})

export class PlateService {
  private queryParamService = inject(QueryParamService);

  private plateDataKey = 'data-plate';

  setPlateData(plateData: EnterPlateDataModel): void {
    localStorage.setItem(this.plateDataKey, JSON.stringify(plateData));
  }

  getPlateData(): EnterPlateDataModel | undefined {
    return JSON.parse(localStorage.getItem(this.plateDataKey));
  }

  getPlate(): Observable<string | null> {
    return this.queryParamService.getQueryParams([ThirdPartyKeysEnum.NoPlate], false).pipe(
      map(params => {
        if (params[ThirdPartyKeysEnum.NoPlate] && params[ThirdPartyKeysEnum.NoPlate] === '1') {
          return null;
        } else {
          return this.getPlateData()?.plate;
        }
      })
    );
  }
}
