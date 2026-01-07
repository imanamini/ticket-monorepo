import { inject, Injectable } from '@angular/core';
import { PolicyCardService } from './policy-card.service';
import { Router } from '@angular/router';
import { PolicyProductCardModel } from '../../../../../../data-access/models/policy-product-card.model';
import { PolicyCardTypeModel } from '../../../../data-access/models/policy-card-type.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyCardThirdPartyCarBimehService extends PolicyCardService {
  private router = inject(Router);

  handleButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): Promise<boolean> {
    return null;
  }

  handleDetailButtonClicked(data: PolicyProductCardModel<PolicyCardTypeModel>): void {
    window.open('https://digipay.bimeh.com/thirdparty?redirectUrlTo=profile/bought', '_blank');
  }

  getActionButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return '';
  }

  getDetailButtonText(data: PolicyProductCardModel<PolicyCardTypeModel>): string {
    return 'جزییات';
  }

  showActionButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }

  showDetailButton(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return true;
  }

  getActionButtonRightIcon(data: PolicyProductCardModel<PolicyCardTypeModel>): { name: string; type: string } | null {
    return null;
  }

  isActionButtonBrand(data: PolicyProductCardModel<PolicyCardTypeModel>): boolean {
    return false;
  }
}
