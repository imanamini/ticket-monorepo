import { AppServiceBadgeMode, AppServiceBadgeStatus } from '@client-monorepo/common/service-data';

export const SERVICE_BADGE_STATUS_MAPPER = {
  [AppServiceBadgeStatus.INFO]: 'info',
  [AppServiceBadgeStatus.SUCCESS]: 'success',
  [AppServiceBadgeStatus.WARNING]: 'warning',
  [AppServiceBadgeStatus.ERROR]: 'error',
  [AppServiceBadgeStatus.INACTIVE]: 'inactive',
};

export const SERVICE_BADGE_MODE_MAPPER = {
  [AppServiceBadgeMode.BOLD]: 'bold',
  [AppServiceBadgeMode.FILL]: 'fill',
  [AppServiceBadgeMode.OUTLINE]: 'outline',
};
