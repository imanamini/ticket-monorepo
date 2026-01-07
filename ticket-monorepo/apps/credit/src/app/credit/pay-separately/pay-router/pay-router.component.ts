import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { CreditApiService } from '../../api/credit-api.service';
import { CreditPayService } from '../../shared/services/credit-pay.service';
import { LocationTrap } from '../../credit-ui/location-trap/location-trap';
import { PurchaseRouteAction } from '../../api/purchase/purchase-route-info.response';
import { ApiResponse } from '../../api/api-response.model';
import { CountdownEvent } from 'ngx-countdown';

interface HiddenFormData extends ApiResponse {
  url: string;
  redirectMethod: 'POST' | 'GET';
  data: string;
}

@Component({
  selector: 'app-pay-router',
  templateUrl: './pay-router.component.html',
  styleUrls: ['./pay-router.component.scss']
})
export class PayRouterComponent extends LocationTrap implements OnInit {

  countdownTime = 30;
  ticketId: string;
  mainLabel: string;
  redirectUrl: string;
  redirectForm: {
    url: string,
    method: 'POST' | 'GET',
    data: {name: string, value: string}[],
  };
  gettingRouteInfo: boolean;
  @ViewChild('hiddenPaymentForm', {static: false}) hiddenPaymentForm: ElementRef;
  routeAction: PurchaseRouteAction;
  title: string;
  submitFormTryCount = 0;
  maxSubmitFormTry = 30;
  gettingRedirectFormInfo: boolean;
  messageImage = 'assets/pay/smile-card.svg';

  constructor(
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private creditApiService: CreditApiService,
    private creditPayService: CreditPayService
  ) {
    super();
    this.canExitTrap = true;
    this.canBackTrap = false;
  }

  ngOnInit() {
    this.ticketId = this.activatedRoute.snapshot.paramMap.get('ticket');
    this.storage.set({ticket: this.ticketId});
    this.getRouteInfo();
  }

  getRouteInfo() {
    this.gettingRouteInfo = true;
    this.creditApiService.getPurchaseRouteInfo(this.ticketId).subscribe(response => {
      this.routeAction = response.action;
      this.title = response.title;
      this.mainLabel = response.mainLabel;
      this.redirectUrl = response.redirectUrl;
      this.createRedirectForm();
      if (response.delay && this.routeAction === 'MIDDLE_PAGE') {
        this.countdownTime = response.delay;
      } else {
        setTimeout(() => {
          this.submitRedirectForm();
        }, response.delay ? +response.delay : 10);
      }
      this.gettingRouteInfo = false;
    }, error => {
      this.creditPayService.goToErrorPage(error && error.result && error.result.message ? error.result.message : '');
    });
  }

  createRedirectForm() {
    this.gettingRedirectFormInfo = true;
    this.creditApiService.getByUrl<HiddenFormData>(this.redirectUrl).subscribe(response => {
      let data: {name: string, value: string}[] = [];
      if (response.data) {
        const responseData = JSON.parse(response.data);
        data = Object.keys(responseData).map(key => {
          return {
            name: key,
            value: responseData[key]
          };
        });
      }
      let url = response.url;
      if (response.redirectMethod === 'GET' && url.includes('?')) {
        const responseOfQueryParamsOfUrl = this.getQueryParamsOfUrl(url);
        url = responseOfQueryParamsOfUrl.url;
        data = data.concat(responseOfQueryParamsOfUrl.params);
      }
      this.redirectForm = {
        url: url,
        method: response.redirectMethod,
        data
      };
      this.gettingRedirectFormInfo = false;
    }, error => {
      this.creditPayService.goToErrorPage(error && error.result && error.result.message ? error.result.message : '');
    });
  }

  getQueryParamsOfUrl(url: string): {url: string, params: {name: string, value: string}[]} {
    const params = [];
    const urlParts = url.split('?');
    if (!urlParts[1]) {
      return {url: urlParts[0], params};
    }
    urlParts[1].split('&').forEach(queryStringItem => {
      const queryStringItemParts = queryStringItem.split('=');
      if (queryStringItemParts[0] && queryStringItemParts[1]) {
        params.push({name: queryStringItemParts[0], value: queryStringItemParts[1]});
      }
    })
    return {url: urlParts[0], params};
  }

  countdownHandler($event: CountdownEvent) {
    if ($event.action === 'done') {
      this.submitRedirectForm();
    }
  }

  submitRedirectForm() {
    if (this.redirectForm) {
      this.hiddenPaymentForm.nativeElement.submit();
    } else {
      this.submitFormTryCount++;
      if (this.submitFormTryCount > this.maxSubmitFormTry) {
        this.creditPayService.goToErrorPage();
      }
      setTimeout(() => {
        this.submitRedirectForm();
      }, 500);
    }
  }
}
