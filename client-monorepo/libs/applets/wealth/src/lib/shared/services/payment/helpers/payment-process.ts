import { inject, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { AbTestService } from '@client-monorepo/common/utilities';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { RESULT_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { ICreatePaymentResult } from '../../../../features/purchase/models/create-payment-result.interface';
import { ICheckoutRequest } from '../../../../components/core/models/fund-schemas/fund-checkout-request.interface';
import { EIpoPaymentMethodAgreement } from '../../../../features/choice-payment-way/models/ipo-payment-method-agreement';

@Injectable({
  providedIn: 'root',
})
export class PaymentProcess {
  private readonly renderer: Renderer2;
  private _location = inject(Location);

  constructor(
    private readonly eventService: NgxEventTrackerService,
    private readonly hybridService: NgxHybridServiceService,
    private readonly navigationService: WealthNavigationService,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public _processCheckout(href: string, data: ICheckoutRequest) {
    this._IPGEvent(data.symbol, data.amount);
    this.replaceUrl(data.symbol, data.isCrowdFunding);

    const body = this.document?.body;
    if (!body) {
      this.openIPG(href);
      return;
    }

    const link = this.renderer.createElement('a') as HTMLAnchorElement;
    this.renderer.setAttribute(link, 'href', href);
    this.renderer.setAttribute(link, 'target', this.formTarget());
    this.renderer.appendChild(body, link);
    link.click();
    this.renderer.removeChild(body, link);
  }

  public _processPayment(result: ICreatePaymentResult, data: ICheckoutRequest) {
    this._IPGEvent(data.symbol, data.amount);
    this.replaceUrl(data.symbol);
    const response = data.isCrowdFunding ? undefined : this.tryParseParams(result.params);

    if (result.method === 'IPG_POST') {
      this.openIPGUsingPostMethod(result.url, response ?? {});
    } else if (result.method === 'IPG_GET') {
      const targetUrl = this.buildUrlWithParams(result.url, response);
      this.openIPG(targetUrl);
    } else if (data.ipoPaymentMethod === EIpoPaymentMethodAgreement.ByCredit) {
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          isSuccess: 'true',
          action: 'investment',
          receiptNumber: result.remoteOrderId,
          broker: result.method === 'BROKER_CREDIT',
          ipoDate: result?.metadata?.IpoDate?.replaceAll('/', '-'),
          instrumentSymbol: result.instrumentSymbol,
          type: result.investmentType,
        },
      });
    } else {
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          isSuccess: 'true',
          action: 'investment',
          instrumentSymbol: result.instrumentName,
          receiptNumber: result.remoteOrderId,
        },
      });
    }
  }

  private tryParseParams(raw: string | null | undefined): Record<string, unknown> | undefined {
    if (!raw) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : undefined;
    } catch {
      return undefined;
    }
  }

  private openIPGUsingPostMethod(url: string, data: Record<string, unknown> | undefined): void {
    const body = this.document?.body;
    if (!body) {
      this.openIPG(url);
      return;
    }

    const form = this.renderer.createElement('form') as HTMLFormElement;
    this.renderer.setAttribute(form, 'method', 'POST');
    this.renderer.setAttribute(form, 'action', url);
    this.renderer.setAttribute(form, 'target', '_self');

    Object.entries(data ?? {}).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      const input = this.renderer.createElement('input') as HTMLInputElement;
      this.renderer.setAttribute(input, 'type', 'hidden');
      this.renderer.setAttribute(input, 'name', key);
      this.renderer.setAttribute(input, 'value', String(value));
      this.renderer.appendChild(form, input);
    });

    this.renderer.appendChild(body, form);
    form.submit();
    this.renderer.removeChild(body, form);
  }

  public openIPG(url: string) {
    const target = this.formTarget();
    const win = this.getBrowserWindow();
    if (win) {
      win.open(url, target);
    }
  }

  private formTarget(): string {
    let target = '_self';
    if (this.hybridService.isAndroidHybrid() || this.hybridService.isIosHybrid()) {
      target = '_blank';
    }

    return target;
  }

  public replaceUrl(symbol?: string, isCrowdFunding?: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      if (symbol?.toLowerCase() === 'treasury') {
        this._location.replaceState(`/mini-app/wealth/wallets/${symbol}`);
      } else {
        this._location.replaceState(
          '/mini-app/wealth/result',
          `incomplete=true&instrumentSymbol=${symbol}&type=${isCrowdFunding ? 'CrowdFund' : 'Fund'}`,
        );
      }

      resolve(true);
    });
  }

  private _IPGEvent(symbol: string, amount: number) {
    this.eventService.sendEvent({
      eventName: EIntrackEventName.PAYMENT_START,
      eventData: {
        Fund_Id: symbol,
        Amount: amount,
      },
    });
  }

  private buildUrlWithParams(baseUrl: string, params?: Record<string, unknown>): string {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const validEntries = Object.entries(params).filter(([, value]) => value !== null && value !== undefined);
    if (validEntries.length === 0) {
      return baseUrl;
    }

    try {
      const origin = this.document?.location?.origin ?? (typeof window !== 'undefined' ? window.location.origin : undefined);
      const url = origin ? new URL(baseUrl, origin) : new URL(baseUrl);
      validEntries.forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
      return url.toString();
    } catch {
      return this.appendParamsFallback(baseUrl, validEntries);
    }
  }

  private appendParamsFallback(baseUrl: string, entries: [string, unknown][]): string {
    const search = new URLSearchParams();
    entries.forEach(([key, value]) => {
      search.append(key, String(value));
    });
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${search.toString()}`;
  }

  private getBrowserWindow(): Window | null {
    return this.document?.defaultView ?? (typeof window !== 'undefined' ? window : null);
  }
}
