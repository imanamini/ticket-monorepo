import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { MetricMatadataModel, MetricModel } from '../../features/vehicle/data-access/models/metric.model';
import { BaseApiService } from '../../features/vehicle/data-access/services/shared/base-api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UatGeneralResponse } from '../../features/vehicle/data-access/models/uat-general.response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NoInterceptorService } from './no-interceptor.service';
import { METRIC_STEPS } from '../../features/vehicle/data-access/constants/metric-steps.constant';
import { v4 as uuidv4 } from 'uuid';
import { UserAuthService } from './user-services/user-auth.service';
import { InsuranceProductTypeEnum } from '../enums/Insurance-product-type.enum';

@Injectable({
  providedIn: 'root',
})
export class MetricService extends BaseApiService {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  noInterceptorService = inject(NoInterceptorService);
  userAuthService = inject(UserAuthService);
  lastPage: string;
  hasSentOnLoadMetrics = false;
  ngZone = inject(NgZone);

  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.lastPage = this.getPageTitle();
  }

  sendRouteChangeMetrics(): void {
    if (!this.hasSentOnLoadMetrics) {
      this.sendLoadMetric();
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          const tmpPage = this.getPageTitle();
          if (tmpPage === this.lastPage) {
            return;
          }
          this.lastPage = tmpPage;
          this.sendMetric(tmpPage, this.router.url, this.getMetaData());
        },
      });
  }

  sendLoadMetric(): void {
    this.sendMetric(this.getPageTitle() ?? '', this.router.url, this.getMetaData());
    this.hasSentOnLoadMetrics = true;
  }

  sendMetric(
    name: string,
    route: string,
    metadata: MetricMatadataModel[],
    productType: InsuranceProductTypeEnum = InsuranceProductTypeEnum.ThirdParty,
  ): void {
    this.ngZone.runOutsideAngular(() => {
      const prevMetricData: MetricModel = this.getLocalStorageMetricData();
      const metricData: MetricModel = {
        name: name ? `${METRIC_STEPS[name]} - ${name}` : '',
        route,
        lastName: prevMetricData?.name,
        lastRoute: prevMetricData?.route,
        guid: this.getGuid(),
        userId: this.userAuthService.getStorageAuthToken()?.auth?.userId,
        productType,
        metadata,
      };
      this.postSingleMetric(metricData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.updateLocalStorageMetricData(metricData);
          },
        });
    });
  }

  getGuid(): string {
    const prevMetricData: MetricModel = this.getLocalStorageMetricData();
    let guid: string;
    if (!this.doesMetricContainsGuid(prevMetricData)) {
      guid = `${uuidv4()} ${new Date().toISOString()}`;
      this.updateLocalStorageMetricData(prevMetricData);
    } else {
      guid = prevMetricData.guid;
    }
    return guid;
  }

  doesMetricContainsGuid(metric: MetricModel): boolean {
    return !!metric?.guid;
  }

  getLocalStorageMetricData(): MetricModel {
    return JSON.parse(localStorage.getItem('metric'));
  }

  updateLocalStorageMetricData(metricData: MetricModel): void {
    const stringifiedMetricData = JSON.stringify(metricData);
    localStorage.setItem('metric', stringifiedMetricData);
  }

  postSingleMetric(metricData: MetricModel): Observable<UatGeneralResponse<boolean>> {
    return this.noInterceptorService.post(`${this.baseUrl}observations/metrics`, {
      body: metricData,
      tokenType: 'bearer',
      options: {
        keepalive: true,
      },
    });
  }

  getPageTitle(): string {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot?.data?.title ?? null;
  }

  getMetaData(): MetricMatadataModel[] {
    const queryParams: Params = this.activatedRoute.snapshot.queryParams;
    const metaData: MetricMatadataModel[] = [];
    Object.entries(queryParams).forEach((entry) => {
      metaData.push({
        key: entry[0],
        value: entry[1],
      });
    });
    return metaData;
  }

  resolverServiceMetric(name: string, metadata: MetricMatadataModel[]): void {
    this.ngZone.runOutsideAngular(() => {
      const prevMetricData: MetricModel = this.getLocalStorageMetricData();
      const metricData: MetricModel = {
        name: name ? `${METRIC_STEPS[name]} - ${name}` : '',
        guid: this.getGuid(),
        userId: this.userAuthService.getStorageAuthToken()?.auth?.userId,
        metadata,
        productType: InsuranceProductTypeEnum.ThirdParty,
      };
      this.postSingleMetric(metricData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.updateLocalStorageMetricData(metricData);
          },
        });
    });
  }
}
