import { THIRD_PARTY_PAGE_TILES_TRANSLATOR, ThirdPartyPageTitlesEnum } from './third-party-page-titles.enum';
import { HOUSE_INCIDENTS_PAGE_TITLE_TRANSLATOR } from './house-incidents-page-title.enum';
import { MOTOR_THIRD_PARTY_TITLES_TRANSLATOR } from './motor-third-party-page-title.enum';

export enum InsurancePageTitleEnum {
  Default = 'بیمه | دیجی‌پی',
}

export const INSURANCE_PAGE_TILES_TRANSLATOR = {
  ...THIRD_PARTY_PAGE_TILES_TRANSLATOR,
  ...HOUSE_INCIDENTS_PAGE_TITLE_TRANSLATOR,
  ...MOTOR_THIRD_PARTY_TITLES_TRANSLATOR
};
