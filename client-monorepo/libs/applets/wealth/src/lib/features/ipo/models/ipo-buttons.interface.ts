import { EIPOButtons } from './ipo-buttons.enum';

export interface IButton {
  id: EIPOButtons | string;
  label?: string;
  style?: string;
  isActive?: boolean;
  leftIcon?: {
    name: string;
    type: string;
  };
  disabled?: boolean;
  loading?: boolean;
}
