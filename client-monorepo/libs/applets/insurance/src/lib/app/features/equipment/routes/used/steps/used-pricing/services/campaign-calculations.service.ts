import { Injectable } from '@angular/core';
import { UsedPremiumCalculationModel } from '../models/used-premium-calculation.model';
import { MessageService } from '@client-monorepo/common/utilities';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CampaignCalculationsModel } from '../models/campaign-calculations.model';
import { UsedApiService } from '../../../../../api/services/used/used-api.service';
import { SaleChannelEnum } from '../../../../../shared-steps/models/sales-channel.enum';
import { DiscountCampaignModel } from '../../../../../api/models/used/discount-campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignCalculationsService {
  private campaignItemSource: BehaviorSubject<CampaignCalculationsModel> = new BehaviorSubject<CampaignCalculationsModel>(null);
  public campaignItem$: Observable<CampaignCalculationsModel> = this.campaignItemSource.asObservable();
  private discountCampaignCode: string;

  public get campaignItem(): CampaignCalculationsModel {
    return this.campaignItemSource.getValue();
  }

  constructor(
    private apiService: UsedApiService,
    private messageService: MessageService) {
  }

  campaignCalculations(uniqueCode: string, suggestedPrice: number): Observable<CampaignCalculationsModel> {
    return this.apiService.getPremiumCalculation({
      products: [{
        uniqueCode,
        price: suggestedPrice,
        category: 'MOBILE'
      }]
    }).pipe(
      map((response) => this.handlePremiumResponse(response.data)),
      catchError((err) => {
        this.messageService.showErrorIfExists(err);
        return throwError(() => err);
      }));
  }

  private handlePremiumResponse(response: UsedPremiumCalculationModel[]): CampaignCalculationsModel {
    if (response?.length > 0) {
      const res: UsedPremiumCalculationModel = response[0];
      let campaignItem: CampaignCalculationsModel;
      if (res.campaignWageAmount) {
        campaignItem = {
          wageAmount: res.campaignWageAmount / 10,
          campaignWageAmount: res.wageAmount / 10,
          campaignDiscount: res.campaignDiscount,
          campaignDiscountCode: this.discountCampaignCode
        };
      } else {
        campaignItem = {wageAmount: res.wageAmount / 10, campaignWageAmount: 0, campaignDiscount: 0};
      }
      this.campaignItemSource.next(campaignItem);
      return campaignItem;
    }
    return this.resetCampaignItem();
  }

  public resetCampaignItem(): CampaignCalculationsModel {
    this.campaignItemSource.next(null);
    return {
      wageAmount: 0,
      campaignWageAmount: 0,
      campaignDiscount: 0
    };
  }

  getCampaignDiscount(): Observable<DiscountCampaignModel> {
    return this.apiService.getDiscountCampaign(SaleChannelEnum.USED_DEVICE).pipe(
      map((response) => {
        if (response?.data) {
          this.discountCampaignCode = response.data.discountCode;
          this.campaignItemSource.next({campaignDiscountCode: response.data.discountCode, ...this.campaignItem});
        }
        return response?.data || null;
      })
    );
  }
}
