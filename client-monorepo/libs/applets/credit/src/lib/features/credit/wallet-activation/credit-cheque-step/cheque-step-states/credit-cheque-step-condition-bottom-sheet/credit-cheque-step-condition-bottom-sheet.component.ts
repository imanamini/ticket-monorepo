import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { StepFlow } from '../../../../data-access/models/credit/activation/get-activation-step-detail.response';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'app-credit-cheque-step-condition-bottom-sheet',
  templateUrl: './credit-cheque-step-condition-bottom-sheet.component.html',
  styleUrls: ['./credit-cheque-step-condition-bottom-sheet.component.scss'],
  standalone: true,
  imports: [
    NgxSkeletonLoadingComponent,
    FormsModule,
    NgxButtonComponent,
    ApiImageModule,
    NgxTrackableIdDirective,
    NgxCalloutComponent,
    NgxBottomSheetHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepConditionBottomSheetComponent implements OnInit {
  isInstallment = signal(false);
  stepFlows = signal<StepFlow[]>([]);
  title = computed(() => (this.isInstallment() ? 'شرایط ارائه چک صیادی بنفش' : 'شرایط ارائه چک'));
  messages = computed(() =>
    this.isInstallment()
      ? [
          'تمامی چک‌ها باید به نام خودتان باشند.',
          'چک‌ها می‌توانند متعلق به بانک‌های مختلف باشند.',
          'ثبت همه چک‌ها در سامانه صیاد الزامی‌ست.',
        ]
      : ['چک‌ می‌تواند متعلق به بانک‌های مختلف باشد.', 'ثبت چک‌ در سامانه صیاد الزامی‌ست.'],
  );

  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.stepFlows.set(this.bottomSheetService.data()?.stepFlows || []);
    this.isInstallment.set(this.bottomSheetService.data()?.isInstallment || false);
  }

  onSubmit(): void {
    this.bottomSheetService.outputData.set({ confirmed: true });
    this.bottomSheetService.closeBottomSheet();
  }
}
