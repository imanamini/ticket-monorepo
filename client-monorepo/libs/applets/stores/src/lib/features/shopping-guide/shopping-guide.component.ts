import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineShoppingGuideComponent } from '../../components/online-shopping-guide/online-shopping-guide.component';
import { OnsiteShoppingGuideComponent } from '../../components/onsite-shopping-guide/onsite-shopping-guide.component';
import { QrShoppingGuideComponent } from '../../components/qr-shopping-guide/qr-shopping-guide.component';

import { AccordionConfig, NgxAccordionComponent } from '@digipay/ngx-accordion';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
@Component({
  selector: 'stores-applet-shopping-guide',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, NgxAccordionComponent],
  templateUrl: './shopping-guide.component.html',
  styleUrl: './shopping-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingGuideComponent implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  methods = signal<string[]>([]);
  initialized = signal(false);
  availableMethods = ['online', 'onsite', 'qr'];
  qr = viewChild<NgxAccordionComponent<QrShoppingGuideComponent>>('qr');
  online = viewChild<NgxAccordionComponent<OnlineShoppingGuideComponent>>('online');
  onsite = viewChild<NgxAccordionComponent<OnsiteShoppingGuideComponent>>('onsite');

  accordionConfigs = signal<AccordionConfig<any>[]>([
    {
      component: QrShoppingGuideComponent,
      inputs: { componentId: 'qr' },
      accordionTitle: 'خرید حضوری با اسکن کیوآر کد',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: 'scan',
    },
    {
      component: OnlineShoppingGuideComponent,
      inputs: { componentId: 'online' },
      accordionTitle: 'خرید از فروشگاه‌های آنلاین',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: 'shopping-bag',
    },
    {
      component: OnsiteShoppingGuideComponent,
      inputs: { componentId: 'onsite' },
      accordionTitle: 'خرید حضوری با کارت‌خوان',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: 'bank-card',
    },
  ]);

  bottomNavigationService = inject(NgxBottomNavigationService);

  ngOnInit(): void {
    this.initializeMethods();

    this.bottomNavigationService.hide();
  }

  initializeMethods(): void {
    const paymentTypes = this.activatedRoute.snapshot.paramMap.get('methods');
    if (paymentTypes) {
      const splitPaymentTypes = paymentTypes.split(',');
      for (const paymentType of splitPaymentTypes) {
        if (this.availableMethods.includes(paymentType)) {
          this.methods.update((ex) => ex.concat([paymentType]));
        } else {
          this.methods.set(this.availableMethods);
        }
        this.initialized.set(true);
      }
    }
  }
  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
