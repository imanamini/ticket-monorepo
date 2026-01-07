import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CashOutDataByPanData } from '../models/cash-out-by-pan.model';
import { WalletInfoResponse } from '../models/wallet-info-response.model';

@Injectable()
export class CashOutByPanService {

  data: BehaviorSubject<CashOutDataByPanData | null> = new BehaviorSubject<CashOutDataByPanData | null>(null);
  walletInfo: BehaviorSubject<WalletInfoResponse | null> = new BehaviorSubject<WalletInfoResponse | null>(null);
  servicePath = 'cash-out';

  constructor(
    private router: Router,
  ) {
  }

  nextStep(route:any, data: CashOutDataByPanData) {
    this.mergeData(data);
    // this.router.navigateByUrl(getServicePath(route.service, route.separator, route.path));
  }

  mergeData(dataToMerge: CashOutDataByPanData) {
    const val = this.data.getValue() || {};

    const mergedData = Object.assign(val, dataToMerge);

    this.data.next(mergedData);
  }

  mergeWalletInfo(dataToMerge:any) {
    const walletInfo = this.walletInfo.getValue() || {};

    const mergedData = Object.assign(walletInfo, dataToMerge);

    this.walletInfo.next(mergedData);
  }

  getTacPage() {
    // if (!getTacUrl()) {
    //   return;
    // }

    // const tacUrl: string = getTacUrl();
    // const pageId: string = this.createPageId(tacUrl);
    // const screen: 'MOBILE' | 'DESKTOP' = isMobileDevice() ? 'MOBILE' : 'DESKTOP';
    // switch (screen) {
    //   case "MOBILE":
    //     this.bottomSheet.open(PageDialogComponent, {
    //       panelClass: ['page-bottom-sheet'],
    //       data: {
    //         title: 'قوانین و مقررات',
    //         pageId: pageId,
    //       }
    //     });
    //
    //     break;
    //
    //   case "DESKTOP":
    //     this.matDialog.open(PageDialogComponent, {
    //       panelClass: ['page-dialog-component'],
    //       data: {
    //         title: 'قوانین و مقررات',
    //         pageId: pageId,
    //       }
    //     });
    //     break;
    // }
  }

  private createPageId(url: string): string {
    return url.substr(url.lastIndexOf('/') + 1);
  }

  backToHome() {
    this.router.navigateByUrl(`/service/${this.servicePath}`);
  }

  setServicePath(url: string) {
    const regex = /cash-out|wallet-transfer/g;
    // @ts-ignore
    this.servicePath = url.match(regex)[0];
  }
}
