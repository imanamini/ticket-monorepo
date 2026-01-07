import { Injectable } from '@angular/core';
import { SERVICE_STATUS, SERVICES_TYPE } from '@client-monorepo/common/subscription';

interface ServiceTypeMappings {
  [status: number]: string;
}

interface StatusColorMappings {
  backgroundColor: string;
  color: string;
}

interface StatusConfig {
  text: string;
  style: { backgroundColor: string; color: string };
}

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private serviceTypeTextMappings: Partial<Record<SERVICES_TYPE, ServiceTypeMappings>> = {
    [SERVICES_TYPE.CREDIT]: {
      [SERVICE_STATUS.INITIATED]: 'تکمیل فرایند ثبت‌نام',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_BNPL_4PAY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_BNPL_1PAY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.COIN]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_BEYOND_INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_FULL_INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.BNPL_6PAY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.BNPL_1PAY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.BNPL_4PAY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_COMPREHENSIVE_INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_AFFORDABLE_INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.CASHBACK]: {
      [SERVICE_STATUS.INITIATED]: '',
      [SERVICE_STATUS.IN_PROGRESS]: '',
      [SERVICE_STATUS.USED]: '',
      [SERVICE_STATUS.REJECTED]: '',
    },
    [SERVICES_TYPE.PURCHASE_CASHBACK]: {
      [SERVICE_STATUS.INITIATED]: '',
      [SERVICE_STATUS.IN_PROGRESS]: '',
      [SERVICE_STATUS.USED]: '',
      [SERVICE_STATUS.REJECTED]: '',
    },
    [SERVICES_TYPE.DPCARD_ISUUANCE]: {
      [SERVICE_STATUS.INITIATED]: '',
      [SERVICE_STATUS.IN_PROGRESS]: '',
      [SERVICE_STATUS.USED]: '',
      [SERVICE_STATUS.REJECTED]: '',
    },
    [SERVICES_TYPE.H_DELIVERY_GUARANTY]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_DISCOUNT_INSURANCE]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_DISCOUNT_STORES]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_WEALTH]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_SUPPORT]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.H_DOCUMENT_FREE_SHIPPING]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
    [SERVICES_TYPE.MERCHANT_CASHBACK]: {
      [SERVICE_STATUS.INITIATED]: 'قابل استفاده',
      [SERVICE_STATUS.IN_PROGRESS]: 'در حال بررسی',
      [SERVICE_STATUS.USED]: 'تخصیص یافته',
      [SERVICE_STATUS.REJECTED]: 'رد شده',
    },
  };

  private statusColorMappings: { [key in SERVICE_STATUS]: StatusColorMappings } = {
    [SERVICE_STATUS.INITIATED]: { backgroundColor: '#FFF5EE', color: '#FA631D' },
    [SERVICE_STATUS.IN_PROGRESS]: { backgroundColor: '#FFFCEE', color: '#FFA700' },
    [SERVICE_STATUS.USED]: { backgroundColor: '#EEFFF6', color: '#5FDA93' },
    [SERVICE_STATUS.REJECTED]: { backgroundColor: '#FFEEF3', color: '#EB2338' },
  };

  private getStatusText(serviceType: SERVICES_TYPE, status: SERVICE_STATUS): string {
    const serviceTypeMapping = this.serviceTypeTextMappings[serviceType];
    return serviceTypeMapping?.[status] || 'Unknown Status';
  }

  private getStatusStyle(status: SERVICE_STATUS): StatusColorMappings {
    return this.statusColorMappings[status] || { backgroundColor: 'white', color: 'black' };
  }

  getStatusConfig(serviceType: SERVICES_TYPE, status: SERVICE_STATUS): StatusConfig {
    return {
      text: this.getStatusText(serviceType, status),
      style: this.getStatusStyle(status),
    };
  }
}
