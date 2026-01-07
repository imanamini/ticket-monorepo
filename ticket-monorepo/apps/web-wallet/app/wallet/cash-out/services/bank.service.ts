import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {CashOutService} from "./cash-out.service";
import {BanksModel} from "../models/banks.model";

@Injectable()
export class BankService {
  cashOutService = inject(CashOutService);
  private activeBanks: BanksModel[] = [];
  private banks: BanksModel[] = [];

  getActiveBanks(): Promise<BanksModel[]> {
    return new Promise((resolve, reject) => {
      if (this.activeBanks?.length > 0) {
        resolve(this.activeBanks);
        return;
      }
      this.cashOutService.getActiveBanks()
        .pipe(
          map((result) => result.banks)
        )
        .subscribe(
          (result: BanksModel[]) => {
            this.activeBanks = result;
            resolve(result);
          },
          (error) => {
            reject(error);
          });
    });
  }

  getBanks(): Promise<BanksModel[]> {
    return new Promise((resolve, reject) => {
      if (this.banks?.length > 0) {
        resolve(this.banks);
        return;
      }
      this.cashOutService.getBanks()
        .pipe(
          map((result) => result.banks)
        )
        .subscribe(
          (result: BanksModel[]) => {
            this.banks = result;
            resolve(result);
          },
          (error) => {
            reject(error);
          });
    });
  }
}
