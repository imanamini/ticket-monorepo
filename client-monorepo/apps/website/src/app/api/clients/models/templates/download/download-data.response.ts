import { BaseResponse } from '../../base.response';
import { ApiFile } from '../../common/api-file';

export interface DownloadDataResponse extends BaseResponse {
  downloadApp: DownloadSectionData;
}

export interface DownloadSectionData {
  web: AppDownloadLink;
  downloadTitle: string;
  downloadSubtitle: string;
  downloadArtwork: ApiFile;
  androidMarketplaces: AppDownloadLink[];
  iosMarketplaces: AppDownloadLink[];
  coupons?: any[];
}

export interface AppDownloadLink {
  title: string;
  address: string;
  type: string;
  titleColor: string;
  icon: ApiFile;
  coupons: {
    text: string;
    code: string;
  };
}
