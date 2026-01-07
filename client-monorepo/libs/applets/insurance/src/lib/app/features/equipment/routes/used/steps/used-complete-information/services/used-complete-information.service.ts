import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { InformationBodyModel } from '../../../../../api/models/used/information-body.model';

@Injectable({
  providedIn: 'root'
})
export class UsedCompleteInformationService {

  informationBehaviorSubject = new BehaviorSubject<InformationBodyModel>(null);

  constructor() {
  }

  setInformation(data: InformationBodyModel): void {
    this.informationBehaviorSubject.next(data);
  }

  getInformationValue(): InformationBodyModel {
    return this.informationBehaviorSubject.getValue();
  }
}
