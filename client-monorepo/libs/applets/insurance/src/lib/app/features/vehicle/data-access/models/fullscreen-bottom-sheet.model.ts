import { ComponentType } from '@angular/cdk/overlay';

export class FullscreenBottomSheetModel {
  component: ComponentType<unknown>;
  title: string;
  fullPage: boolean;
  showHolderIcon?: boolean;
}
