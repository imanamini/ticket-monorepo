import { inject, Injectable } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import {
  PurSchedulesResponse,
  ScheduleAction,
  SchedulePeriodType,
  SchedulesResponse,
  ScheduleTarget,
  TollSchedulePayload,
  UserSchedule,
} from '@client-monorepo/daily-fintech/vehicle-data';

@Injectable({
  providedIn: 'root',
})
export class SchedulesApiService {
  apiService = inject(ApiService);

  getSchedules(): Observable<SchedulesResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `user-schedules`).setParams({
      scheduleAction: ScheduleAction.AUTO_PAY,
      scheduleTarget: ScheduleTarget.TOLL,
    });
    return this.apiService.call<PurSchedulesResponse>(request).pipe(
      map((res) => {
        return {
          ...res,
          schedules: res.schedules.map((item) => {
            return {
              ...item,
              payload: JSON.parse(item.payload) as TollSchedulePayload,
            };
          }),
        };
      }),
    );
  }

  getScheduleDetail(plateNo: string): Observable<UserSchedule | undefined> {
    return this.getSchedules().pipe(
      map((res) => {
        return res.schedules.find((item) => item.payload.plateNo === plateNo);
      }),
    );
  }

  deleteSchedule(scheduleId: string): Observable<GenericApiResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.DELETE, `user-schedules/${scheduleId}`));
  }

  createSchedule(plateNo: string): Observable<GenericApiResponse> {
    const body = {
      payload: JSON.stringify({
        plateNo,
        autoPay: true,
      }),
      action: ScheduleAction.AUTO_PAY,
      periodType: SchedulePeriodType.DAILY,
      target: ScheduleTarget.TOLL,
    };
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, 'user-schedules', body));
  }
}
