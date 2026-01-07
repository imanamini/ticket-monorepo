import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { BillInquiryIdComponent } from '../../componensts/bill-inquiry-id/bill-inquiry-id.component';
import { BillStandardInquiryComponent } from '../../componensts/bill-standard-inquiry/bill-standard-inquiry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BillTelephoneValidateComponent } from '../../componensts/bill-telephone-validate/bill-telephone-validate.component';
import { BillMobileValidateComponent } from '../../componensts/bill-mobile-validate/bill-mobile-validate.component';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { BillApiService } from '@client-monorepo/applets/bill';
import { ActivatedRoute, Router } from '@angular/router';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import { billTypeToPageTitle } from '../../data-access/models/bill-type-to-page-title';
import { BillValidationSkeletonComponent } from '../../componensts/bill-loading-skeleton/bill-validation-skeleton/bill-validation-skeleton.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bill-applet-validate',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    TabGroupComponent,
    FormsModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    BillStandardInquiryComponent,
    BillValidationSkeletonComponent,
  ],
  templateUrl: './bill-validate.component.html',
  styleUrl: './bill-validate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillValidateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private billValidationService = inject(BillValidationService);
  private billApiService = inject(BillApiService);
  private destroyRef = inject(DestroyRef);

  billType = signal<number>(parseInt(this.route.snapshot.params['type']));
  pageTitle = signal('قبض');
  loading = signal(true);
  billMethods = signal<Array<string>>([]);
  tabs = signal<Array<TabConfig>>([]);

  ngOnInit(): void {
    if (this.billType()) {
      this.pageTitle.set(billTypeToPageTitle[this.billType()]);
    }
    this.getData();
  }

  getData(): void {
    this.billApiService
      .getBillConfig()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const billTypeModel = res.configs.find((config) => config.type === this.billType());
        if (billTypeModel) {
          this.billValidationService.billTypeModelState.set(billTypeModel);
          this.billMethods.set(this.billValidationService.getMethodNames(billTypeModel));
          this.pageTitle.set(billTypeModel.pageTitle);
          this.initializeTabConfig(billTypeModel);
        } else {
          this.router.navigateByUrl('/bill').then();
          return;
        }
      });
  }

  initializeTabConfig(billTypeModel: BillTypeModel): void {
    const tabComponents: Record<number, any> = {
      11: BillMobileValidateComponent,
      12: BillMobileValidateComponent,
      7: BillTelephoneValidateComponent,
    };
    const inquiryComponent = tabComponents[billTypeModel.type] || BillInquiryIdComponent;
    const inquiryTabs = [
      this.createTab('استعلام بدهی', true, inquiryComponent),
      this.createTab('پرداخت با شناسه', false, BillStandardInquiryComponent),
    ];
    this.tabs.set(inquiryTabs);
    this.loading.set(false);
  }
  private createTab(label: string, isActive: boolean, component: any): TabConfig {
    return {
      label: signal(label),
      isActive: signal(isActive),
      component: signal(component),
      relatedChildLink: '',
    };
  }
}
