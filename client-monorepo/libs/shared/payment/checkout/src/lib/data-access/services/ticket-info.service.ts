import { inject, Injectable, signal } from '@angular/core';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { PaymentCheckoutApiService } from './payment-checkout-api.service';
import { AppPayFeaturesBody } from '../models/app-pay-features-body.interface';
import { AppPayFeaturesResponse, BPG_PAYMENT_MODE, FeatureName, TicketInfoFeature } from '../models/app-pay-features.response';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DetailCardDataInterface } from '../models/detail-card-data.interface';
import { CreateAppPayTicketResponse } from '../models/create-app-pay-ticket.response';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';

@Injectable({
  providedIn: 'root',
})
export class TicketInfoService {
  public ttl = signal(20 * 60 * 1000); // ttl = time to live, calculated on the backend
  public state!: AppPayFeaturesResponse;
  public ticket = signal('');
  public appPayFeaturesBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  private paymentCheckoutApiService = inject(PaymentCheckoutApiService);
  storageService = inject(StorageService);
  messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  public getAppPayFeatures(data: AppPayFeaturesBody): Observable<AppPayFeaturesResponse> {
    return this.paymentCheckoutApiService.getAppPayFeaturesApi(this.ticket(), data.amount).pipe(
      tap((response: AppPayFeaturesResponse) => {
        response.features.forEach((feature) => {
          feature.method = this.getFeatureMethod(feature);
        });
        this.state = response;
        this.ttl.set(response?.ttl);
        // ToDo: fallbackUrl has to change with callbackUrl after backend fix.
        this.storageService.saveCallbackUrl(response.fallbackUrl || '');
      }),
      catchError((errorResponse) => {
        return throwError(() => errorResponse);
      }),
    );
  }

  private getFeatureMethod(feature: TicketInfoFeature): FeatureName {
    if (feature.name === APP_ACTIONS.PAYMENT_BPG.toString() && feature.bpgMode !== undefined) {
      return (
        feature.bpgMode === BPG_PAYMENT_MODE.BPG_1PAY ? APP_ACTIONS.PAYMENT_BPG_1PAY.toString() : APP_ACTIONS.PAYMENT_BPG_4PAY.toString()
      ) as typeof feature.method;
    }

    return feature.name;
  }

  public getAppPayTicket(data: AppPayFeaturesBody): Observable<CreateAppPayTicketResponse> {
    return this.paymentCheckoutApiService.getAppPayTicketApi(data.type, data.additionalInfo).pipe(
      tap((response: any) => this.ticket.set(response.ticket)), // Store the ticket as before
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        return throwError(() => error); // Re-throw the error for handling in the component
      }),
    );
  }

  public getCachedTicketData(): { cardData: DetailCardDataInterface; featureBody: AppPayFeaturesBody; ticket: string } | undefined | void {
    const ticket = this.activatedRoute.snapshot.queryParams['ticket'];
    if (!ticket) return;

    const tickets = this.storageService.getTicketData();
    const cachedData = tickets?.[ticket];

    if (!cachedData) return;

    const isExpired = Date.now() > Number(cachedData.expTime);

    if (isExpired) {
      this.storageService.removeTicketData(ticket);
      return;
    }

    return {
      cardData: cachedData.cardData,
      featureBody: cachedData.featureBody,
      ticket,
    };
  }

  public cacheTicketData(ticket: string, cardData: DetailCardDataInterface, featureBody: AppPayFeaturesBody): void {
    this.storageService.setTicketData(ticket, {
      cardData,
      featureBody,
      expTime: Date.now() + this.ttl(),
    });
  }
  public revisingCachedTickets() {
    const now = Date.now(); // Get the current timestamp
    const cachedTickets = this.storageService.getTicketData();
    if (!cachedTickets) {
      return;
    }
    Object.keys(cachedTickets).forEach((ticket) => {
      if (cachedTickets[ticket].expTime <= now) {
        this.storageService.removeTicketData(ticket); // Remove expired ticket
      }
    });
  }

  public removeCachedTicket(ticket?: string) {
    const targetedTicket = ticket ?? this.ticket();
    if (targetedTicket) {
      this.storageService.removeTicketData(targetedTicket);
    }
  }
}
