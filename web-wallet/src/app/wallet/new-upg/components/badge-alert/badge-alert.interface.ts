export interface BadgeAlertInterface {
  title?: string;
  description: string;
  submitButtonText: string;
  cancellationButtonText?: string;
  logoPath: string;
  customLogoStyle?: {
    [styleName: string]: string
  };
  customDescriptionStyle?: {
    [styleName: string]: string
  };
  appearance?: 'default' | 'outline' | 'clean' | 'green' | 'blue-text' | 'red-text' | 'outline-light-blue';
}
