import { Component } from '@angular/core';
import { SERVICE_CONNECTION_ERROR_STATE } from './service-connection-error-const';
import { Error } from '../error';

@Component({
  selector: 'app-service-connection',
  templateUrl: './service-connection.component.html',
  styleUrls: ['./service-connection.component.scss']
})
export class ServiceConnectionComponent extends Error {
  state = SERVICE_CONNECTION_ERROR_STATE;

  public backToMerchant(): void {
    this.back();
  }
}
