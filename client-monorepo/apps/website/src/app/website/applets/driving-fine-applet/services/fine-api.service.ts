import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../../../api/base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehiclePlate } from '../../../../api/digipay/models/driving-fine/vehicle-plate';
import { FineConfigResponse } from '../../../../api/digipay/models/driving-fine/fine-config.response';
import { TicketParams } from '../../../../api/digipay/models/payment/ticket-params';

@Injectable({
  providedIn: 'root',
})
export class FineApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  addNewPlate(plateDetails: { plateNo: string; title: string }): Observable<{
    plate: VehiclePlate;
  }> {
    return super.post('/plates', plateDetails);
  }

  getConfig(): Observable<FineConfigResponse> {
    return super.get('/traffic-fines/config');
  }

  getFeatures(ticket: string): Observable<any> {
    return super.get(`/tickets/${ticket}`);
  }

  selectPaymentFeature(body: { featureName: string; ticket: string }): Observable<any> {
    return super.post('tickets/features/select', body);
  }

  verifyInquiryAndGetDetail(trackingCode: string) {
    return super.get(`/traffic-fines/inquiry/${trackingCode}`);
  }

  getPlates(vehicleTypeName: 'CAR') {
    return super.get(`traffic-fines/plates?vehicleTypes=${vehicleTypeName}`);
  }

  getTicket(ticketType, params: TicketParams): Observable<any> {
    return super.post(`tickets?type=${ticketType}`, params);
  }
}
