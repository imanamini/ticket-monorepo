import { computed, inject, Injectable } from '@angular/core';
import { GeoEntityApiService } from './geo-entity-api.service';
import { Coordination, LocationService } from '@client-monorepo/common/location-management';
import { map, Observable, of } from 'rxjs';
import { GetGeoEntitiesResponse } from '../models/get-geo-entities.response';
import { GeoEntity } from '../models/geo-entity';

@Injectable({
  providedIn: 'root',
})
export class GeoEntityService {
  geoEntityApiService = inject(GeoEntityApiService);
  locationService = inject(LocationService);
  geoEntities?: GeoEntity[];
  location = computed<Coordination | undefined>(() => {
    if (this.locationService.lastLocation() && (this.locationService.lastLocation()?.timestamp || 0) > Date.now() - 1000 * 60 * 120) {
      return this.locationService.lastLocation();
    }
    return this.locationService.defaultLocation;
  });

  getGeoEntities(): Observable<GetGeoEntitiesResponse> {
    if (this.geoEntities) {
      return of({ geoEntityLinks: this.geoEntities });
    }
    if (this.location()) {
      return this.geoEntityApiService.getGeoEntities(this.location()!.latitude, this.location()!.longitude).pipe(
        map((res) => {
          this.geoEntities = res.geoEntityLinks;
          return res;
        }),
      );
    }
    return of({ geoEntityLinks: [] });
  }

  getHashMapOfClassName(classNames: string[]): Observable<{ [key: string]: { [key: string]: boolean } }> {
    return this.getGeoEntities().pipe(
      map((res) => {
        const geoEntitiesHashMap: { [key: string]: { [key: string]: boolean } } = {};
        classNames.forEach((className) => {
          geoEntitiesHashMap[className] = {};
        });
        res.geoEntityLinks.forEach((item) => {
          classNames.forEach((className) => {
            if (item.className === className) {
              geoEntitiesHashMap[className][item.objectId] = true;
            }
          });
        });
        return geoEntitiesHashMap;
      }),
    );
  }
}
