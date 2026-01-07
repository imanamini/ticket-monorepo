import { Injectable } from '@angular/core';
import { UiCarrier } from '../../../ui/models/ui-carrier';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';
import { UiOption } from '../../../ui/models/ui-option';
import { PackageGroup } from './models/package-group';
import { UserService } from '../../../core/services/user.service';
import { concatMap } from 'rxjs/operators';
import { OperatorIds } from '../../../api/digipay/models/carrier/operator-ids';
import { SimType } from '../../../api/digipay/models/common/sim-type';
import { InternetPackage, InternetPackagesResponse } from '../../../api/digipay/models/internet';
import { MobileOperator } from '../../../api/digipay/models/carrier/mobile-operator';
import { RecommendationInternet } from '../../../api/digipay/models/recommendation/recommendation-internet';
import { FavouritePackagesResponse } from '../../../api/digipay/models/internet/favourite';
import { TopUpApiService } from '../../../api/digipay/top-up-api.service';
import { RecommendationApiService } from '../../../api/digipay/recommendation-api.service';
import { RECOMMENDATION_TYPES } from '../../../api/digipay/models/recommendation/recommendation-types';
import { InternetApiService } from '../../../api/digipay/internet-api.service';

@Injectable({
  providedIn: 'root',
})
export class InternetService {
  carriers: UiCarrier[] = [
    { value: OperatorIds.MCI, label: 'همراه اول', icon: 'mci' },
    { value: OperatorIds.MTN, label: 'ایرانسل', icon: 'mtn' },
    { value: OperatorIds.RIGHTEL, label: 'رایتل', icon: 'rightel' },
  ];

  simTypes: UiOption[] = [
    { value: SimType.PERMANENT, label: 'دائمی' },
    { value: SimType.CREDIT, label: 'اعتباری' },
    { value: SimType.DATA, label: 'دیتا' },
    { value: SimType.TD_LTE, label: 'TD-LTE' },
  ];

  simTypesGroups = {
    [OperatorIds.MCI]: [
      { value: SimType.PERMANENT, label: 'دائمی' },
      { value: SimType.CREDIT, label: 'اعتباری' },
    ],
    [OperatorIds.MTN]: [
      { value: SimType.PERMANENT, label: 'دائمی' },
      { value: SimType.CREDIT, label: 'اعتباری' },
      { value: SimType.TD_LTE, label: 'TD-LTE' },
    ],
    [OperatorIds.RIGHTEL]: [
      { value: SimType.PERMANENT, label: 'دائمی' },
      { value: SimType.CREDIT, label: 'اعتباری' },
      { value: SimType.DATA, label: 'دیتا' },
    ],
  };

  packagesResponse: BehaviorSubject<InternetPackagesResponse> = new BehaviorSubject(null);

  durations: BehaviorSubject<UiOption[]> = new BehaviorSubject([]);

  selectedDuration: BehaviorSubject<any> = new BehaviorSubject(-1);

  topUpOperators: BehaviorSubject<MobileOperator[]> = new BehaviorSubject([]);

  selectedCarrier: BehaviorSubject<UiCarrier> = new BehaviorSubject(null);

  serviceMessage: BehaviorSubject<string> = new BehaviorSubject(null);

  packages: BehaviorSubject<PackageGroup[]> = new BehaviorSubject([]);

  anyPackageToShow: BehaviorSubject<boolean> = new BehaviorSubject(false);

  selectedSimType: BehaviorSubject<SimType> = new BehaviorSubject(null);

  cellNumber: BehaviorSubject<string> = new BehaviorSubject('');

  recommendations: BehaviorSubject<RecommendationInternet[]> = new BehaviorSubject([]);

  favouriteGroups: BehaviorSubject<FavouritePackagesResponse[]> = new BehaviorSubject([]);

  initialized: Subject<boolean> = new Subject();

  basicDataValidness = new BehaviorSubject({
    cellNumber: false,
    simType: false,
    carrier: false,
  });

  validationMessages: BehaviorSubject<{
    cellNumber: string;
  }> = new BehaviorSubject({
    cellNumber: null,
  });

  gettingPackages: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private topUpApi: TopUpApiService,
    private internetApiService: InternetApiService,
    private user: UserService,
    private recommendationApiService: RecommendationApiService,
  ) {
    this.selectedDuration.asObservable().subscribe((duration) => {
      this.processPackages();
    });

    if (this.user.isLoggedIn.getValue()) {
      this.user.getCellNumber().then((cellNumber) => {
        this.cellNumber.next(cellNumber);
      });
    }

    this.recommendations.asObservable().subscribe((items) => {
      if (items.length === 0) {
        return;
      }

      const requests = [];
      items.forEach((i) => {
        requests.push(this.getFavouritePackages(i));
      });

      const responses = [];

      from(requests)
        .pipe(
          concatMap((item) => {
            return item;
          }),
          // @ts-ignore
        )
        .subscribe((response: FavouritePackagesResponse) => {
          responses.push(response);
          if (responses.length === requests.length) {
            this.favouriteGroups.next(responses);
          }
        });
    });
  }

  initialize(): void {
    this.cellNumber.asObservable().subscribe((cellNumber) => {
      this.findOperatorOfCellNumber();
    });

    this.getInternetOperators();
    if (this.user.isLoggedIn.getValue()) {
      this.getRecommendations();
    }

    // this.selectedSimType.next()

    combineLatest([this.cellNumber.asObservable(), this.selectedSimType.asObservable(), this.selectedCarrier.asObservable()]).subscribe(
      (values) => {
        const cellNumber = this.cellNumber.getValue();
        const messages = {
          cellNumber: '',
        };
        const isValid = {
          cellNumber: true,
          simType: true,
          carrier: true,
        };

        if (!cellNumber || cellNumber.length < 11) {
          isValid.cellNumber = false;
        }
        if (cellNumber && !/^0/.test(cellNumber)) {
          messages.cellNumber = 'شماره تلفن همراه صحیح نیست';
          isValid.cellNumber = false;
        }
        if (cellNumber && cellNumber.length >= 11 && !/^09\d{9}$/.test(cellNumber)) {
          messages.cellNumber = 'شماره تلفن همراه صحیح نیست';
          isValid.cellNumber = false;
        }

        if (!values[1]) {
          isValid.simType = false;
        }
        if (!values[2]) {
          isValid.carrier = false;
        }

        this.validationMessages.next(messages);
        this.basicDataValidness.next(isValid);
      },
    );
  }

  findOperatorOfCellNumber(): void {
    const cellNumber = this.cellNumber.getValue();

    if (!cellNumber || cellNumber.length < 4) {
      return;
    }
    const prefix = cellNumber.substr(0, 4);
    // const prefix2 = cellNumber.substr(0, 5);
    let found: MobileOperator = null;
    let simType = null;
    this.topUpOperators.getValue().forEach((operator) => {
      const has = operator.prefixes.some((prefixItem) => {
        // const prefixFound = prefixItem.value === prefix || prefixItem.value === prefix2;
        const prefixFound = prefixItem.value.startsWith(prefix);
        // if (prefixFound && prefixItem.types.length === 1) {
        if (prefixFound && prefixItem.types.length > 0) {
          simType = prefixItem.types[0];
        }

        return prefixFound;
      });
      if (has) {
        found = operator;
      }
    });
    if (found) {
      const carrier = this.carriers.filter((c) => c.value === found.operatorId)[0];
      this.selectedCarrier.next(carrier);
    }

    // if (simType) {
    //   this.selectedSimType.next(simType);
    // }
  }

  getPackages(): void {
    const carrier = this.selectedCarrier.getValue();
    if (!carrier) {
      return;
    }

    this.clearPackages();

    const params = {
      cellNumber: this.cellNumber.getValue(),
      cellNumberType: this.selectedSimType.getValue(),
    };

    this.internetApiService.getInternetPackage(carrier.value, params).subscribe(
      (response) => {
        if (!response.bundleCategories) {
          // sometimes response doesn't have the `bundleCategories` key
          response.bundleCategories = [];
        }
        this.packagesResponse.next(response);
        const options: UiOption[] = [
          {
            label: 'همه',
            value: -1,
          },
        ].concat(
          response.bundleCategories.map((bundle, i) => {
            return {
              label: bundle.title,
              value: i,
            };
          }),
        );

        this.durations.next(options);
        this.processPackages();
        this.gettingPackages.next(false);
      },
      (e) => {
        this.gettingPackages.next(false);
        if (e.status === 422 && e.error.result && e.error.result.message) {
          this.serviceMessage.next(e.error.result.message);
        }
      },
    );
  }

  processPackages(): void {
    const response = this.packagesResponse.getValue();
    const duration = this.selectedDuration.getValue();
    const simType = this.selectedSimType.getValue();

    if (!response) {
      return;
    }

    // default is "ALL durations"
    let categories = [].concat(response.bundleCategories);
    if (duration !== -1) {
      // filter the categories using the selected index
      categories = [response.bundleCategories[duration]];
    }

    const packageGroups: PackageGroup[] = [];
    let anyPackage = false;
    categories.forEach((category) => {
      if (!category || !category.bundleSections) {
        return;
      }
      category.bundleSections.forEach((section) => {
        section.bundles = section.bundles.filter((b) => b.type === simType);
        let packages: InternetPackage[] = [];
        section.bundles.forEach((b) => {
          packages = packages.concat(b.internetPackages);
          if (b.internetPackages.length > 0) {
            anyPackage = true;
          }
        });
        packageGroups.push({
          title: section.title,
          packages,
        });
      });
    });

    this.anyPackageToShow.next(anyPackage);
    this.packages.next(packageGroups);
  }

  private getInternetOperators(): void {
    this.topUpApi.getTopUpOperators().subscribe((response) => {
      this.topUpOperators.next(response.topUpOperators);
      this.findOperatorOfCellNumber();
      this.initialized.next(true);
    });
  }

  private getRecommendations(): void {
    this.recommendationApiService.getRecommendations(RECOMMENDATION_TYPES.INTERNET).subscribe((r) => {
      this.recommendations.next(r.recommendations);
    });
  }

  private getFavouritePackages(item: RecommendationInternet): Observable<any> {
    const params = {
      cellNumber: item.id,
    };
    return this.internetApiService.getFavouriteInternetPackages(item.operator, params);
  }

  private clearPackages(): void {
    this.serviceMessage.next(null);
    this.gettingPackages.next(true);
    this.packagesResponse.next(null);
    this.packages.next([]);
    this.durations.next([]);
  }
}
