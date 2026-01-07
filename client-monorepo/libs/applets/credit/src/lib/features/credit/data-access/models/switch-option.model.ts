export class SwitchOption {
  backgroundColor!: string;
  borderColor!: string;
  text!: string;
  id!: string;
  isActive?: boolean;
  textColor?: string;
}

export interface SwitchTab {
  [key: string]: SwitchOption;
}
