import { inject, Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { AppApiService } from './app-api.service';
import { FrequentServiceInterface } from '../models/frequent-service.interface';
import { frequentServices } from '../consts/frequent-services.const';
import { AppServiceStatusEnum } from '../models/app-service-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  appApiService = inject(AppApiService);
  getMappedServices(): Observable<Array<FrequentServiceInterface>> {
    return new Observable<Array<FrequentServiceInterface>>((observer) => {
      zip([this.appApiService.getAppServicesList(), this.appApiService.getPersonalizedServices()]).subscribe({
        next: ([appServicesRes, personalizedServicesRes]) => {
          const appServices = appServicesRes.appServices;
          const personalizedServices = personalizedServicesRes.servicesId ?? [];
          const result = appServices
            .filter((service) => service.serviceName in frequentServices)
            .map((service) => {
              const frequentService = frequentServices[service.serviceName];
              frequentService.priority = service.priority;
              frequentService.title = service.title;
              frequentService.type = service.type;
              frequentService.status = service.status;
              if (service.status === AppServiceStatusEnum.DISABLED) {
                frequentService.badge = { status: 4, mode: 0, content: 'غیر فعال' };
              } else {
                frequentService.badge = service.badge;
              }
              frequentService.categories = [...service.categories];
              frequentService.uuid = service.id;
              frequentService.selected = personalizedServices.includes(frequentService.uuid);
              const userPriorityIndex = personalizedServices.indexOf(frequentService.uuid);
              frequentService.userPriority = userPriorityIndex !== -1 ? userPriorityIndex : null;
              frequentService.tags = service.tags ? [...service.tags] : [];
              return frequentService;
            })
            .sort((a, b) => {
              if (!a.priority || !b.priority) return 0;
              return a.priority > b.priority ? 1 : -1;
            });
          observer.next(result);
          observer.complete();
        },
      });
    });
  }
  getServices(): Observable<Array<FrequentServiceInterface>> {
    return new Observable<Array<FrequentServiceInterface>>((observer) => {
      this.appApiService.getAppServicesList().subscribe({
        next: (appServicesRes) => {
          const appServices = appServicesRes.appServices;
          const result = appServices
            .filter((service) => service.serviceName in frequentServices)
            .map((service) => {
              const frequentService = frequentServices[service.serviceName];
              frequentService.priority = service.priority;
              frequentService.title = service.title;
              frequentService.type = service.type;
              frequentService.status = service.status;
              if (service.status === AppServiceStatusEnum.DISABLED) {
                frequentService.badge = { status: 4, mode: 0, content: 'غیر فعال' };
              } else {
                frequentService.badge = service.badge;
              }
              frequentService.categories = [...service.categories];
              frequentService.uuid = service.id;
              frequentService.selected = false;
              frequentService.userPriority = null;
              frequentService.tags = service.tags ? [...service.tags] : [];
              return frequentService;
            })
            .sort((a, b) => {
              if (!a.priority || !b.priority) return 0;
              return a.priority > b.priority ? 1 : -1;
            });
          observer.next(result);
          observer.complete();
        },
      });
    });
  }
}
