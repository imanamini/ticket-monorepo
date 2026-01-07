import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditUrlService } from '../../data-access/utils/url';
import { Router } from '@angular/router';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgTemplateOutlet } from '@angular/common';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';

@Component({
  selector: 'app-credit-account-suspend',
  templateUrl: './credit-account-suspend.component.html',
  styleUrls: ['./credit-account-suspend.component.scss'],
  standalone: true,
  imports: [CreditScrollableViewComponent, NgxStatusResultModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountSuspendComponent implements OnInit {
  backButtonLink!: string;
  buttons = signal<Buttons[]>([
    {
      id: 'primary',
      style: 'fill',
      mode: 'section',
      label: 'متوجه شدم',
    },
  ]);
  serviceTypeName = signal('');
  title = computed(() => `شما در صف دریافت ${this.serviceTypeName()} قرار گرفتید.`);
  description = computed(
    () =>
      `به دلیل تعداد بالای درخواست‌ها، فرایند دریافت ${this.serviceTypeName()} شما به طور موقت متوقف شده است. به محض باز شدن ظرفیت، از طریق پیامک به شما اطلاع می‌دهیم.`,
  );

  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);
  private creditServiceTypeService = inject(CreditServiceTypeService);

  ngOnInit() {
    this.serviceTypeName.set(this.creditServiceTypeService.isBnpl() ? 'اعتبار اقساطی' : 'وام');
    this.backButtonLink = this.creditUrlService.getInnerServicePath('/overview');
  }

  onPrimaryButtonClick() {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
  }
}
