import { ComponentType } from '@angular/cdk/overlay';
import { ComponentRef, inject, Injectable, ViewContainerRef } from '@angular/core';
import { ScreenMode } from '../../../utils/screen-mode';
import { PaymentMethodComponent } from '../components/payment-method/payment-method.component';
import { TacComponent } from '../components/tac/tac.component';
import { BottomSheetService } from './bottom-sheet.service';

@Injectable()
export class FactoryService {
  static componentRef: ComponentRef<any>;
  static container: ViewContainerRef;
  private bottomSheetService = inject(BottomSheetService);

  public createComponent(component: ComponentType<any>): void {
    switch (new ScreenMode().get()) {
      case 'DESKTOP':
        this.updatePage(component);
        break;

      case 'MOBILE':
        if (component === TacComponent || component === PaymentMethodComponent) {
          this.updatePage(component);
        } else {
          this.updatePage(PaymentMethodComponent); // Component PaymentMethod have toTo show on the back of the screen all the time.
          this.openBottomSheet(component);
        }
        break;
      default:
        break;
    }
  }

  private updatePage(component: ComponentType<any>): void {
    if (FactoryService.componentRef) {
      FactoryService.componentRef.destroy();
    }
    FactoryService.componentRef = FactoryService.container.createComponent(component);
  }

  private openBottomSheet(component: ComponentType<any>): void {
    this.bottomSheetService.open(component);
  }
}
