import { ServiceType } from './card-api.interface';

export interface CardPreviewConfigInterface {
  id?: string;
  classes?: string;
  bankName?: string;
  bankLogoId?: string;
  cardNumber?: string;
  expDate?: string;
  ownerName?: string;
  baseColor?: string;
  isDestination?: boolean;
  isLoading?: boolean;
  isPinned?: boolean;
  isMinimized?: boolean;
  isExpanded?: boolean;
  isSkeleton?: boolean;
  width?: string;
  postfix?: string;
  prefix?: string;
  attachedServiceType?: ServiceType[];
  alias?: string;
  maskCardNumber?: boolean;
}
