import { Injectable } from '@angular/core';
import { NobitexApiService, validateUserInShahkar } from './nobitex-api.service';
import { CalculationFilter } from '../../../ui/models/credit/calculation-filter.model';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { estimateNobitexResponse } from '../../../ui/models/nobitex/estimate-nobitex.response';
import { InquiryResponse } from '../../../ui/models/nobitex/inquiry.response';
import { IdentityInfo } from '../../../ui/models/nobitex/identity-info.model';
import { nobitexCredit } from '../../../ui/models/nobitex/nobitex-credit.model';
import { nobitexError } from '../models/nobitex/nobitexError';

@Injectable({
  providedIn: 'root',
})
export class NobitexCreditService {
  filters: CalculationFilter;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  identityStatus: BehaviorSubject<IdentityInfo> = new BehaviorSubject(<IdentityInfo>{});
  disableSubmitBtn = new BehaviorSubject(false);
  showSpinner = new BehaviorSubject(false);
  error: BehaviorSubject<nobitexError> = new BehaviorSubject<nobitexError>(<nobitexError>{});

  submittedNobitexCreit: BehaviorSubject<boolean> = new BehaviorSubject(false);
  submittedNobitexCreit$ = this.submittedNobitexCreit.asObservable();

  estimate = new BehaviorSubject(false);
  estimate$ = this.estimate.asObservable();

  amount: BehaviorSubject<number | null> = new BehaviorSubject(null);
  amount$ = this.amount.asObservable();

  progressValue: BehaviorSubject<number> = new BehaviorSubject(0);
  progressValue$ = this.progressValue.asObservable();

  nobitexInput: nobitexCredit = {};

  nobitexCalculator: any = {
    installment: [
      {
        installmentCount: '4',
        installmentAmount: '1000000',
        subtitle: ' ماهه',
        profit: '23',
        wage: '12',
        activeIcon: {
          path: '/2023/08/69f45a11-cdc9-4486-b6e0-835222d26fc5.svg',
          url: 'https://uatsite.mydigipay.info/api/website/proxy/get-file/public/2023/08/69f45a11-cdc9-4486-b6e0-835222d26fc5.svg',
          name: '69f45a11-cdc9-4486-b6e0-835222d26fc5.svg',
          altText: '69f45a11-cdc9-4486-b6e0-835222d26fc5.svg',
        },
        inactiveIcon: {
          path: '/2023/08/fec5571e-d1cc-4765-b4a0-07e35e8d9586.svg',
          url: 'https://uatsite.mydigipay.info/api/website/proxy/get-file/public/2023/08/fec5571e-d1cc-4765-b4a0-07e35e8d9586.svg',
          name: 'fec5571e-d1cc-4765-b4a0-07e35e8d9586.svg',
          altText: 'fec5571e-d1cc-4765-b4a0-07e35e8d9586.svg',
        },
        installmentDetail: [
          { icon: 'icon-stepper-1', title: 'مرحله اول', subtitle: 'زمان خرید' },
          {
            icon: 'icon-stepper-2',
            title: 'مرحله دوم',
            subtitle: 'یکم ماه اول',
          },
          {
            icon: 'icon-stepper-3',
            title: 'مرحله سوم',
            subtitle: 'یکم ماه دوم',
          },
          {
            icon: 'icon-stepper-4',
            title: 'مرحله چهارم',
            subtitle: 'یکم ماه سوم',
          },
        ],
        profitType: 'overall',
      },
    ],
    recipeTitle: 'محدوده مبلغ اعتبار مورد نظرت را انتخاب کن.',
    startAmount: 10000000,
  };

  constructor(private nobitexApiService: NobitexApiService) {}

  getInquiry(input: validateUserInShahkar) {
    this.showSpinner.next(true);
    return this.nobitexApiService.getInQuiry(input).pipe(
      tap((result: InquiryResponse) => {
        this.identityStatus.next(result.IdentityInfo);
        this.showSpinner.next(false);
      }),
    );
  }

  estimateNobitexCredit(cellNumber: string, nationalCode: string, birthDate: number) {
    return this.nobitexApiService.estimateNobitexCredit(cellNumber, nationalCode, birthDate).pipe(
      tap((result: estimateNobitexResponse) => {
        this.amount.next(<number>result.amount);
      }),
      finalize(() => {
        this.showSpinner.next(false);
      }),
    );
  }

  isUserIdentified() {
    return this.identityStatus.asObservable();
  }

  getDisableSubmitBtn() {
    return this.disableSubmitBtn.asObservable();
  }

  getError() {
    return this.error.asObservable();
  }
}
