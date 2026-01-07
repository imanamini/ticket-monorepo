import { ComponentType } from '@angular/cdk/overlay';
import { ComponentRef, inject, Injectable, signal, ViewContainerRef } from '@angular/core';
import { TacComponent } from '../../components/tac/tac.component';
import { PaymentMethodComponent } from '../../components/payment-method/payment-method.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PageEnum } from '../models/page.enum';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class FactoryService {
  static componentRef: ComponentRef<any>;
  static container: ViewContainerRef;
  private bottomSheetService = inject(NgxBottomSheetService);
  private urlService = inject(UrlService);
  public isBottomSheetOpen = signal(false);

  public createComponent(component: ComponentType<any>, config?: Record<string, any>): void {
    if (component === TacComponent || component === PaymentMethodComponent) {
      this.updatePage(component);
    } else {
      this.openBottomSheet(component, config);
    }
  }

  private updatePage(component: ComponentType<any>): void {
    if (FactoryService.componentRef) {
      FactoryService.componentRef.destroy();
    }
    FactoryService.componentRef = FactoryService.container.createComponent(component);
  }

  private openBottomSheet(component: ComponentType<any>, config = {}): void {
    this.bottomSheetService.openBottomSheet(component, {}, { noPadding: true, ...config });
    this.isBottomSheetOpen.set(true);
    const onCloseSubscription = this.bottomSheetService.onClose.subscribe(() => {
      this.isBottomSheetOpen.set(false);
      setTimeout(() => {
        this.urlService.addPageToQueryParam(PageEnum.PAYMENT_METHOD); // every time after close bottom sheet, we have payment method page as current page.
      }, 0);
      onCloseSubscription.unsubscribe();
      return;
    });
  }
}
