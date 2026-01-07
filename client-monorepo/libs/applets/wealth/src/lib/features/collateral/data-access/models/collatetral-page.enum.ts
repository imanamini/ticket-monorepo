import {
  CAMPAIGN_OTP_ROUTE,
  CAMPAIGN_SHAHKAR_ERROR_ROUTE,
  COLLATERAL_APPROVED_ROUTE,
  COLLATERAL_REJECTED_ROUTE,
  COLLATERAL_ROUTE,
  COLLATERAL_WAITING_ROUTE,
  CONFIRM_COLLATERAL_INFO_ROUTE,
  SEJAM_ERROR_ROUTE,
  TREASURE_HUNT_NATIONAL_ID_ROUTE,
} from '../../../../data-access/constants/app-routes';

export const COLLATERAL_PAGE_ROUTE_MAP: Record<string, string> = {
  page_global_otp: CAMPAIGN_OTP_ROUTE,
  page_collateral_landing: COLLATERAL_ROUTE,
  page_global_sejami_exception: SEJAM_ERROR_ROUTE,
  page_collateral_pending: COLLATERAL_WAITING_ROUTE,
  page_collateral_rejected: COLLATERAL_REJECTED_ROUTE,
  page_collateral_approved: COLLATERAL_APPROVED_ROUTE,
  page_global_national_id: TREASURE_HUNT_NATIONAL_ID_ROUTE,
  page_global_shahkar_exception: CAMPAIGN_SHAHKAR_ERROR_ROUTE,
  page_collateral_form_confirm: CONFIRM_COLLATERAL_INFO_ROUTE,
};
