import { VehicleCardStatusToCtaMap } from '../models/vehicle-card-status-to-cta-map';

export const vehicleCardStatusToCtaMapConst: VehicleCardStatusToCtaMap = {
  paid: {
    content: 'پرداخت شده',
    btnStyle: 'link',
    icon: 'wallet-check',
    iconDirection: 'right',
  },
  paying: {
    content: 'در حال پرداخت',
    btnStyle: 'link',
    icon: 'wallet-out',
    iconDirection: 'right',
  },
  unpaid: {
    content: 'پرداخت',
    btnStyle: 'tinted-on-elevated',
    icon: 'arrow-2-left',
    iconDirection: 'left',
  },
  'no-service': {
    content: 'بررسی دوباره',
    btnStyle: 'tinted-on-elevated',
    icon: 'refresh',
    iconDirection: 'left',
  },
  'not-enough-balance': {
    content: 'موجودی ناکافی',
    btnStyle: 'link',
    icon: 'info-circle',
    destructive: true,
    iconDirection: 'right',
  },
  'need-inquiry': {
    content: 'استعلام',
    btnStyle: 'tinted-on-elevated',
    icon: 'arrow-2-left',
    iconDirection: 'left',
  },
};
