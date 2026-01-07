import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { HouseIncidentsActionService } from './data-access/services/house-incidents-action.service';
import { HouseIncidentsApiService } from './data-access/services/house-incidents-api.service';
import { HOUSE_INCIDENTS_URLS } from './data-access/constants/house-incidents-urls';
import { HouseIncidentsDataStorageService } from './data-access/services/house-incidents-data-storage.service';
import { HouseIncidentsServiceActionType } from './data-access/enums/house-incidents-service-action-type.enum';
import { InsDigikalaService } from '../../data-access/services/ins-digikala.service';

@Injectable({
  providedIn: 'root',
})
export class JourneyTypeResolve implements Resolve<any> {
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private houseIncidentsApiService = inject(HouseIncidentsApiService);
  private houseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  private digikalaService = inject(InsDigikalaService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return new Observable((observer) => {
      const appId = this.houseIncidentsDataStorageService.getApplicationFormId() ?? route.queryParams.appId;
      const journeyType = this.digikalaService.isDigikala
        ? HouseIncidentsServiceActionType.B
        : this.houseIncidentsDataStorageService.getJourneyType();
      if (appId && journeyType) {
        this.houseIncidentsActionService.setServiceType(journeyType);
        observer.next(true);
      } else if (this.isInStartOfJourney(state.url)) {
        this.callOrderJourneyType(observer);
      }
    });
  }

  callOrderJourneyType(observer: Observer<any>): void {
    this.houseIncidentsApiService.orderJourneyType(null, null).subscribe({
      next: (result) => {
        this.houseIncidentsDataStorageService.storeJourneyType(result.result.journeyType);
        this.houseIncidentsActionService.setServiceType(result.result.journeyType);
        this.houseIncidentsDataStorageService.storeApplicationFormId(result.result.id);
        observer.next(true);
      },
    });
  }

  isInStartOfJourney(url: string): boolean {
    return url.includes(HOUSE_INCIDENTS_URLS.PLP);
  }
}
