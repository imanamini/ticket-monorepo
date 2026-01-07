import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, ReplaySubject, Subject, Subscription } from 'rxjs';
import { convertNonEnglishDigits, currencyFormat } from '@digipay/strings';
import { MobileOperator } from '../../../../api/digipay/models/carrier/mobile-operator';
import { UiCarrier } from '../../../../ui/models/ui-carrier';
import { OperatorIds } from '../../../../api/digipay/models/carrier/operator-ids';
import { TopUpPackagesResponse } from '../../../../api/digipay/models/top-up/top-up-packages.response';
import { TopUpApiService } from '../../../../api/digipay/top-up-api.service';
import { TOP_UP_CHARGE_TYPES } from '../../../../api/digipay/models/top-up/top-up-types';
import { RecommendationApiService } from '../../../../api/digipay/recommendation-api.service';
import { RECOMMENDATION_TYPES } from '../../../../api/digipay/models/recommendation/recommendation-types';
import { RecommendationResponse } from '../../../../api/digipay/models/recommendation/recommendation.response.model';
import { UserService } from '../../../../core/services/user.service';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { SimType } from '../../../../api/digipay/models/common/sim-type';

@Injectable({
  providedIn: 'root',
})
export class TopUpAppletService {
  carriers: UiCarrier[] = [
    { value: OperatorIds.MCI, label: 'همراه اول', icon: 'mci' },
    { value: OperatorIds.MTN, label: 'ایرانسل', icon: 'mtn' },
    { value: OperatorIds.RIGHTEL, label: 'رایتل', icon: 'rightel' },
  ];

  selectedCarrier: BehaviorSubject<UiCarrier> = new BehaviorSubject(null);

  selectedSimType = new BehaviorSubject(SimType.CREDIT);

  cellNumber: BehaviorSubject<string> = new BehaviorSubject('');

  amount: BehaviorSubject<string> = new BehaviorSubject('');

  topUpOperators: BehaviorSubject<MobileOperator[]> = new BehaviorSubject([]);

  suggestions: BehaviorSubject<string[]> = new BehaviorSubject([]);

  fascinating: BehaviorSubject<boolean> = new BehaviorSubject(false);

  initialized: ReplaySubject<boolean> = new ReplaySubject(1);

  gettingPackages: Subject<boolean> = new Subject();

  cachedResponses: {
    [key: string]: TopUpPackagesResponse;
  } = {};

  topUpPackagesResponse: BehaviorSubject<TopUpPackagesResponse> = new BehaviorSubject(null);

  lastLoadedOperatorId: BehaviorSubject<string> = new BehaviorSubject(null);

  serviceMessage: BehaviorSubject<string> = new BehaviorSubject(null);

  formValidness: BehaviorSubject<boolean> = new BehaviorSubject(false);

  formValidnessDetails: BehaviorSubject<{
    cellNumber?: string;
    amount?: string;
    amountRange?: string;
    amountFactor?: string;
  }> = new BehaviorSubject({});

  supportFascinating: BehaviorSubject<{
    description: string;
    subDescription: string;
    enableCustomAmount: boolean;
  }> = new BehaviorSubject(null);

  gettingPackagesSubscription: Subscription;

  recommendations: BehaviorSubject<RecommendationResponse> = new BehaviorSubject<RecommendationResponse>(null);

  constructor(
    private topUpApi: TopUpApiService,
    private userService: UserService,
    private recommendationApiService: RecommendationApiService,
    private cache: MemoryCacheService,
  ) {}

  initialize(): void {
    this.cellNumber.asObservable().subscribe((cellNumber) => {
      this.findOperatorOfCellNumber();
    });

    this.getTopUpOperators();
    const isLoggedIn = this.userService.isLoggedIn.getValue();

    if (isLoggedIn) {
      this.getRecommendations();
      this.userService.getCellNumber().then((cellNumber: string) => {
        this.cellNumber.next(cellNumber);
      });
    }

    this.selectedCarrier.asObservable().subscribe((carrier) => {
      if (carrier) {
        // resetting the fascinating value will
        // cause in reloading the packages
        this.fascinating.next(false);
      }
    });

    this.fascinating.asObservable().subscribe((fascinating) => {
      this.getTopUpPackages();
      this.serviceMessage.next(null);
      // this.amount.next('');
    });

    combineLatest([this.cellNumber.asObservable(), this.amount.asObservable(), this.fascinating.asObservable()]).subscribe((values) => {
      this.checkValidness();
    });
  }

  getTopUpOperators(): void {
    const cacheKey = 'TOP_UP_OPERATORS';

    const cached = this.cache.get(cacheKey, null);
    if (cached) {
      this.topUpOperators.next(cached.topUpOperators);
      this.findOperatorOfCellNumber();
      this.initialized.next(true);
      return;
    }

    this.topUpApi.getTopUpOperators().subscribe((response) => {
      this.topUpOperators.next(response.topUpOperators);
      this.findOperatorOfCellNumber();
      this.cache.put(cacheKey, response);
      this.initialized.next(true);
    });
  }

  findOperatorOfCellNumber(): void {
    const cellNumber = this.cellNumber.getValue();

    if (!cellNumber || cellNumber.length < 4) {
      return;
    }
    const prefix = cellNumber.substr(0, 4);
    const prefix2 = cellNumber.substr(0, 5);
    let found: MobileOperator = null;
    this.topUpOperators.getValue().forEach((operator) => {
      const has = operator.prefixes.some((prefixItem) => {
        return prefixItem.value === prefix || prefixItem.value === prefix2;
      });
      if (has) {
        found = operator;
      }
    });
    if (found) {
      const carrier = this.carriers.filter((c) => c.value === found.operatorId)[0];
      this.selectedCarrier.next(carrier);
    }
  }

  private checkValidness(): void {
    const cellNumber = this.cellNumber.getValue();
    const amount = this.amount.getValue();
    const details = {
      amount: null,
      cellNumber: null,
      amountFactor: null,
      amountRange: null,
    };
    let isValid = true;
    if (!cellNumber) {
      isValid = false;
    }
    if (cellNumber && !/^0/.test(cellNumber)) {
      details.cellNumber = 'شماره تلفن همراه صحیح نیست';
      isValid = false;
    }
    if (cellNumber.length < 11) {
      isValid = false;
    }
    if (cellNumber && cellNumber.length >= 11 && !/^09\d{9}$/.test(cellNumber)) {
      details.cellNumber = 'شماره تلفن همراه صحیح نیست';
      isValid = false;
    }

    const convertedAmount = parseInt(convertNonEnglishDigits(amount), 10);
    if (!convertedAmount || isNaN(convertedAmount)) {
      details.amount = '';
      isValid = false;
    }

    const response = this.topUpPackagesResponse.getValue();
    if (response) {
      if (+amount % response.amountFactor !== 0) {
        details.amountFactor = 'مقدار وارد شده می‌بایست ضریبی از ' + currencyFormat(response.amountFactor) + ' ریال باشد';
        isValid = false;
      }
      if (+amount < response.minAmount || +amount > response.maxAmount) {
        details.amountRange = `مقدار وارد شده می‌بایست بین ${currencyFormat(
          response.minAmount,
        )} تا ${currencyFormat(response.maxAmount)} ریال باشد`;
        isValid = false;
      }
    }

    this.formValidness.next(isValid);
    this.formValidnessDetails.next(details);
  }

  private getTopUpPackages(): void {
    const carrier = this.selectedCarrier.getValue();
    if (!carrier) {
      return;
    }
    if (this.lastLoadedOperatorId.getValue() === carrier.value) {
      // already loaded
      this.processPackagesResponse(carrier);
      return;
    }
    if (this.gettingPackagesSubscription) {
      this.gettingPackagesSubscription.unsubscribe();
    }
    if (this.cachedResponses.hasOwnProperty(carrier.value)) {
      // use the cache copies and don't send request again
      this.topUpPackagesResponse.next(this.cachedResponses[carrier.value]);
      this.processPackagesResponse(carrier);
      return;
    }
    this.gettingPackages.next(true);
    this.gettingPackagesSubscription = this.topUpApi.getTopUpPackages(carrier.value).subscribe(
      (response) => {
        this.gettingPackages.next(false);
        this.cachedResponses[carrier.value] = response;
        this.topUpPackagesResponse.next(response);
        this.processPackagesResponse(carrier);
      },
      (e) => {
        this.gettingPackages.next(false);
        if (e.status === 422 && e.error.result && e.error.result.message) {
          this.serviceMessage.next(e.error.result.message);
        }
      },
    );
  }

  private processPackagesResponse(carrier: UiCarrier): void {
    const response = this.topUpPackagesResponse.getValue();
    this.lastLoadedOperatorId.next(carrier.value);
    const fascinating = this.fascinating.getValue();
    let suggestions = [];
    let supportFascinating = null;
    response.topUpInfos.map((group) => {
      if (group.chargeType === TOP_UP_CHARGE_TYPES.FASCINATING) {
        supportFascinating = {
          description: group.description,
          subDescription: group.subDescription,
          enableCustomAmount: group.variantAvailable,
        };
      }
      if (fascinating && group.chargeType === TOP_UP_CHARGE_TYPES.FASCINATING) {
        suggestions = group.chargePackages.map((chargePackage) => {
          return String(chargePackage.amount);
        });
      }
      if (!fascinating && group.chargeType === TOP_UP_CHARGE_TYPES.REGULAR) {
        suggestions = group.chargePackages.map((chargePackage) => {
          return String(chargePackage.amount);
        });
      }
    });
    this.amount.next(String(response.defaultChargePackage));
    this.supportFascinating.next(supportFascinating);
    this.suggestions.next(suggestions);
    const amount = this.amount.getValue();
    if (amount) {
      if (suggestions.filter((s) => s === amount).length === 0) {
        // there is no suggestion with the current amount value
        this.amount.next('');
      }
    }
  }

  private getRecommendations(): void {
    this.recommendationApiService.getRecommendations(RECOMMENDATION_TYPES.TOP_UP).subscribe((response) => {
      this.recommendations.next(response);
    });
  }
}
