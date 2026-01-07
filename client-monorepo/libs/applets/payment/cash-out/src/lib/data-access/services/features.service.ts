import { Injectable } from '@angular/core';
import { Feature } from '../models/feature.model';
import { FEATURE_NAMES, FEATURES } from '@client-monorepo/payment/purchase';
import { PROTECTIONS } from '@client-monorepo/common/user';

// processed copy of the api features
export interface AppFeature {
  title: string;
  editable: boolean;
  protectedBy: string;
  protectionStatus: number;
  code: number;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  statuses: {
    [key: string]: AppFeature;
  } = {};
  private map = {
    [FEATURES['PAYMENT_WALLET']]: FEATURE_NAMES.PAYMENT_WALLET,
    [FEATURES['PAYMENT_DPG']]: FEATURE_NAMES.PAYMENT_DPG,
    [FEATURES['PAYMENT_IPG']]: FEATURE_NAMES.PAYMENT_IPG,
    [FEATURES['SETTINGS']]: FEATURE_NAMES.SETTINGS,
    [FEATURES['SETTINGS_PASSWORD']]: FEATURE_NAMES.SETTINGS_PASSWORD,
    [FEATURES['LOGIN_HOME']]: FEATURE_NAMES.LOGIN_HOME,
    [FEATURES['SDK_INFO']]: FEATURE_NAMES.SDK_INFO,
  };
  private protectionMap: any = {
    [PROTECTIONS.NONE]: 'NONE',
    [PROTECTIONS.PIN]: 'PIN',
    [PROTECTIONS.OTP]: 'OTP',
    [PROTECTIONS.IN_APP_VERIFICATION]: 'IN_APP_VERIFICATION',
  };

  /**
   * Transform API response and store features
   * Used after getting or calling the update API
   */
  setFeatures(apiFeaturesResponse: any) {
    Object.keys(apiFeaturesResponse.features).forEach((featureKey: any) => {
      const feature = apiFeaturesResponse.features[featureKey] as Feature;
      this.statuses[this.map[featureKey]] = {
        title: feature.title || null!,
        editable: feature.editable,
        protectedBy: this.protectionMap[feature.isProtected],
        protectionStatus: feature.isProtected,
        code: parseInt(featureKey, 10),
        url: feature.url ? feature.url : null!,
      };
    });
  }

  /**
   *
   * @param featureName
   */
  getFeature(featureName: any): AppFeature {
    return this.statuses[featureName];
  }
}
