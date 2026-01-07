import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseLayoutComponent} from "../../../layout/base-layout/base-layout.component";
import {delay, EMPTY, from, mergeMap, of} from "rxjs";
import {PageClient} from "../../../../api/clients/page-client";
import {OnboardingHeaderComponent} from "./onboarding-header/onboarding-header.component";
import {OnboardingVideoComponent} from "./onboarding-video/onboarding-video.component";
import {BnplInfoComponent} from "./bnpl-info/bnpl-info.component";
import {BnplUsageComponent} from "./bnpl-usage/bnpl-usage.component";
import {BnplStepsComponent} from "./bnpl-steps/bnpl-steps.component";
import {InstallmentRulesComponent} from "./installment-rules/installment-rules.component";
import {
  BnplOnboardingTemplateData, bnplUsageCategory
} from "../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {
  FaqComponent
} from "../../../../../../../../libs/applets/wealth/src/lib/features/faq/containers/faq/faq.component";
import {UiFaqComponent} from "../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component";
import {BnplOnboradingApiService} from "../../../../api/digipay/bnpl-onborading.api.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, OnboardingHeaderComponent, OnboardingVideoComponent, BnplInfoComponent, BnplUsageComponent, BnplStepsComponent, InstallmentRulesComponent, FaqComponent, UiFaqComponent,],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingComponent implements OnInit {

  private pageClient = inject(PageClient);

  loaded = signal(false);

  onboardingTemplateData = signal<BnplOnboardingTemplateData | null>(null);

  BnplOnboradingApiService = inject(BnplOnboradingApiService);

  ngOnInit(): void {
    this.pageClient.getPage('landings', 'bnpl-onboarding').subscribe((res) => {
      this.onboardingTemplateData.set(res.page.templateData);
      const categories: bnplUsageCategory[] = res.page.templateData.bnplUsage.categories as bnplUsageCategory[];

      from(categories).pipe(
        mergeMap(category => {
          const merchantCodes = category.merchants.map(m => m.trackingCode);

          return merchantCodes.length > 0
            ? this.BnplOnboradingApiService.fetchRecappedMerchants(merchantCodes).pipe(
              map(response => {
                category.recappedMerchants = response.merchants;
                return category;
              })
            )
            : EMPTY;
        })
      ).subscribe();


      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded.set(true);
          },
        });
    });
  }
}
