import { VehicleCardStatus } from '@client-monorepo/daily-fintech/vehicle-card';
import { ButtonStyle } from '@digipay/ngx-button';

export type VehicleCardStatusToCtaMap = {
  [key in VehicleCardStatus]: {
    content: string;
    btnStyle: ButtonStyle;
    icon: string;
    destructive?: boolean;
    iconDirection: 'right' | 'left';
  };
};
