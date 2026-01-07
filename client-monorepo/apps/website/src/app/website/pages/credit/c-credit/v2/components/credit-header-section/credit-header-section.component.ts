import { ChangeDetectionStrategy, Component, Inject, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SectionIntro } from '../../../../../../../api/clients/models/templates/c-credit/c-credit-v2-template-data';
import { CreditCalculatorV2Service } from '../../../../../../../api/clients/credit/credit-calculator/credit-calculator-v2.service';
import { DeviceDetectorService } from '../../../../../../../core/services/device/deviceDetector.service';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'app-credit-header-section',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgOptimizedImage, NgxIcon, PipesModule],
  templateUrl: './credit-header-section.component.html',
  styleUrl: './credit-header-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditHeaderSectionComponent implements OnInit {
  data = input.required<SectionIntro>();

  creditCalculatorV2Service = inject(CreditCalculatorV2Service);

  bestPlan = signal<{ amount: number; installmentCount: number } | null>(null);
  deviceDetectorService = inject(DeviceDetectorService);

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit(): void {
    this.creditCalculatorV2Service.init().then(() => {
      this.bestPlan.set(this.creditCalculatorV2Service.maxAmountAndInstallments());
    });
  }
  onButtonClick(link: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = link;
    }
  }
}
