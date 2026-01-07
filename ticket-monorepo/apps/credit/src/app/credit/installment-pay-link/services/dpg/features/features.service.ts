import { Injectable } from '@angular/core';

import { PROTECTIONS, FEATURES, FEATURE_NAMES } from '../dpg-pay/models/features';

import { Feature } from '../../../../api/tac/in-app-tac-response';
import { CreditHttpService } from '../../../../api/credit-http.service';
import { UserService } from '../user/user.service';

// processed copy of the api features
export interface AppFeature {
  title: string;
  editable: boolean;
  protectedBy: string;
  protectionStatus: number;
  code: number;
  url: string;
}

@Injectable()
export class FeaturesService {

  statuses: {
    [key: string]: AppFeature,
  } = {};
  private map = {
    [FEATURES.PAYMENT_WALLET]: FEATURE_NAMES.PAYMENT_WALLET,
    [FEATURES.PAYMENT_DPG]: FEATURE_NAMES.PAYMENT_DPG,
    [FEATURES.PAYMENT_IPG]: FEATURE_NAMES.PAYMENT_IPG,
    [FEATURES.SETTINGS]: FEATURE_NAMES.SETTINGS,
    [FEATURES.SETTINGS_PASSWORD]: FEATURE_NAMES.SETTINGS_PASSWORD,
    [FEATURES.LOGIN_HOME]: FEATURE_NAMES.LOGIN_HOME,
    [FEATURES.SDK_INFO]: FEATURE_NAMES.SDK_INFO,
  };
  private protectionMap = {
    [PROTECTIONS.NONE]: 'NONE',
    [PROTECTIONS.PIN]: 'PIN',
    [PROTECTIONS.OTP]: 'OTP',
    [PROTECTIONS.IN_APP_VERIFICATION]: 'IN_APP_VERIFICATION',
  };

  constructor(
    private api: CreditHttpService,
    private userService: UserService,
  ) {
    userService.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.getFeatures();
      }
    });
  }

  /**
   * Get features list from the API and transform them to
   * a key-value pair
   */
  getFeatures(callback = null) {
    this.api.get('users/features').subscribe(data => {
      this.setFeatures(data);
      if (callback && typeof callback === 'function') {
        callback(data);
      }
    });
  }

  /**
   * Transform API response and store features
   * Used after getting or calling the update API
   */
  setFeatures(apiFeaturesResponse) {
    Object.keys(apiFeaturesResponse.features).forEach(featureKey => {
      const feature = apiFeaturesResponse.features[featureKey] as Feature;
      this.statuses[this.map[featureKey]] = {
        title: feature.title || null,
        editable: feature.editable,
        protectedBy: this.protectionMap[feature.isProtected],
        protectionStatus: feature.isProtected,
        code: parseInt(featureKey, 10),
        url: feature.url ? feature.url : null,
      };
      this.setHasPassword();
    });
  }

  setHasPassword() {
    const hasPassword = Object.values(this.statuses).some(p => p.protectionStatus === 1);
    this.userService.userHasPassword.next(hasPassword);
  }

  getFeature(featureName): AppFeature {
    return this.statuses[featureName];
  }

}
