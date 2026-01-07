export interface ButtonToggleInterface {
  backgroundColor?: string;
  borderColor?: string;
  title: string;
  value: string;
  icon?: string;
  imageId?: string;
  isActive?: boolean;
  textColor?: string;
}

export interface SwitchTab {
  [key: string]: ButtonToggleInterface;
}
