import { inject, Injectable, signal } from '@angular/core';
import { NgxHybridService, PermissionListEnum } from '@digipay/ngx-hybrid-service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { finalize, from, Observable, of, shareReplay, timeout } from 'rxjs';
import { AccessModesEnum, LocationAccessComponent } from '@client-monorepo/common/location-management';
import { Coordination } from '../models/coordination';
import { StorageService } from '@client-monorepo/common/utilities';
import { LocationStatusEnum } from '../models/location-status.enum';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private ngxHybridService = inject(NgxHybridService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private storageService = inject(StorageService);
  public lastLocation = signal<Coordination | undefined>(undefined);
  private _locationRequest$: Observable<Coordination | null> | null = null;
  defaultLocation: Coordination = {
    latitude: 35.758198,
    longitude: 51.4073231,
  };
  constructor() {
    this.lastLocation.set(this.storageService.getLastLocation());
  }
  public getLocation(isForce = false, ttl = 3600000): Observable<Coordination | null> {
    if (this._locationRequest$) {
      return this._locationRequest$;
    }
    this._locationRequest$ = new Observable<Coordination | null>((subscriber) => {
      this.getPermission(isForce, ttl).subscribe({
        next: (result) => {
          if (result === AccessModesEnum.ACCESS) {
            this.getLocationBasedOnPlatform().subscribe({
              next: (result) => {
                if (result) {
                  this.lastLocation.set({ ...result, timestamp: Date.now() });
                  this.storageService.setLastLocation(this.lastLocation()!);
                  if (result && !this.storageService.hasSetLocation()) {
                    this.storageService.setHasLocation();
                  }
                }
                subscriber.next(result);
                subscriber.complete();
              },
            });
          } else {
            subscriber.next(null);
            subscriber.complete();
          }
        },
      });
    }).pipe(
      shareReplay(1),
      finalize(() => {
        this._locationRequest$ = null;
      }),
    );
    return this._locationRequest$;
  }

  public getGuaranteedLocation(
    isForce = false,
    ttl = 60 * 60 * 1000,
    timeoutLimit = 10 * 1000,
    lastLocationTtl = 2 * 60 * 1000,
  ): Observable<{ coordination: Coordination; state: LocationStatusEnum }> {
    if (this.lastLocationIsValid(lastLocationTtl)) {
      return of({
        coordination: this.lastLocation()!,
        state: LocationStatusEnum.STORAGE,
      });
    } else {
      return new Observable((subscriber) => {
        this.getLocation(isForce, ttl)
          .pipe(timeout(timeoutLimit))
          .subscribe({
            next: (result) => {
              if (result) {
                subscriber.next({
                  coordination: result!,
                  state: LocationStatusEnum.LIVE,
                });
                subscriber.complete();
              } else {
                subscriber.next({
                  coordination: this.defaultLocation,
                  state: LocationStatusEnum.DEFAULT,
                });
                subscriber.complete();
              }
            },
            error: () => {
              subscriber.next({
                coordination: this.defaultLocation,
                state: LocationStatusEnum.DEFAULT,
              });
              subscriber.complete();
            },
          });
      });
    }
  }

  private lastLocationIsValid(ttl = 600000): boolean {
    const now = Date.now();
    return !!this.lastLocation() && !!this.lastLocation()?.timestamp && now - (this.lastLocation()?.timestamp || 0) <= ttl;
  }

  public getPermission(isForce = false, ttl = 3600000): Observable<AccessModesEnum> {
    return new Observable<AccessModesEnum>((subscriber) => {
      this.checkPermission().subscribe({
        next: (result) => {
          if (result) {
            subscriber.next(AccessModesEnum.ACCESS);
            subscriber.complete();
          } else {
            if (this.checkTtl(isForce, ttl)) {
              this.openLocationBottomSheet().subscribe({
                next: (bottomSheetResult) => {
                  if (bottomSheetResult) {
                    if (this.ngxHybridService.isHybrid()) {
                      this.ngxHybridService
                        .getPermissions([PermissionListEnum.LOCATION])
                        .then((result) => {
                          const newresult: string[] = result.map((item) => String(item));
                          if (newresult.includes(String(PermissionListEnum.LOCATION))) {
                            subscriber.next(AccessModesEnum.ACCESS);
                            subscriber.complete();
                          } else {
                            subscriber.next(AccessModesEnum.NOACESS);
                            subscriber.complete();
                          }
                        })
                        .catch((error) => {
                          console.warn('[LocationService] Failed to get location permissions from native bridge:', error);
                          // Assume no access on error
                          subscriber.next(AccessModesEnum.NOACESS);
                          subscriber.complete();
                        });
                    } else if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        () => {
                          subscriber.next(AccessModesEnum.ACCESS);
                          subscriber.complete();
                        },
                        () => {
                          subscriber.next(AccessModesEnum.NOACESS);
                          subscriber.complete();
                        },
                      );
                    } else {
                      subscriber.next(AccessModesEnum.NOACESS);
                      subscriber.complete();
                    }
                  } else {
                    subscriber.next(AccessModesEnum.LATER);
                    subscriber.complete();
                  }
                },
              });
            } else {
              subscriber.next(AccessModesEnum.NOACESS);
              subscriber.complete();
            }
          }
        },
      });
    });
  }

  private checkPermission(): Observable<boolean> {
    if (this.ngxHybridService.isHybrid()) {
      return from(
        this.ngxHybridService.checkPermissions().then((result) => {
          const permissions = result.map(String);
          return permissions.includes(String(PermissionListEnum.LOCATION));
        }),
      );
    }

    if (!navigator.permissions || !navigator.geolocation) {
      return of(false);
    }

    return from(
      navigator.permissions.query({ name: 'geolocation' }).then((status: PermissionStatus) => {
        if (status.state === 'granted') return true;
        return status.state === 'prompt' && this.storageService.hasSetLocation();
      }),
    );
  }
  private openLocationBottomSheet(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.bottomSheetService.openBottomSheet(LocationAccessComponent, {});
      const sheetSub = this.bottomSheetService.onClose.subscribe(() => {
        sheetSub.unsubscribe();
        const result = this.bottomSheetService.outputData();
        this.storageService.setLocationTimeStamp(Date.now());
        subscriber.next(result?.isAllowed ?? false);
        subscriber.complete();
      });
    });
  }

  private checkTtl(isForce: boolean, ttl: number): boolean {
    if (isForce) {
      return true;
    }
    const lastTime = this.storageService.getLocationTimeStamp();
    if (!lastTime) {
      return true;
    }
    const now = Date.now();
    return now - lastTime >= ttl;
  }

  private getLocationBasedOnPlatform(): Observable<Coordination | null> {
    return new Observable<Coordination | null>((subscriber) => {
      if (this.ngxHybridService.isHybrid()) {
        this.ngxHybridService.requestToEnableGps().then(() => {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              const { latitude, longitude } = position.coords;
              subscriber.next({ latitude, longitude } as Coordination);
              subscriber.complete();
            },
            () => {
              subscriber.next(null);
              subscriber.complete();
            },
          );
        });
      } else {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            subscriber.next({ latitude, longitude } as Coordination);
            subscriber.complete();
          },
          () => {
            subscriber.next(null);
            subscriber.complete();
          },
        );
      }
    });
  }

  public checkLocationCollection(ttl = 604800000): boolean {
    const now = Date.now();
    const timeStamp = this.storageService.getLocationEventTimeStamp();
    if (!timeStamp) {
      return true;
    } else {
      return now - timeStamp > ttl;
    }
  }
}
