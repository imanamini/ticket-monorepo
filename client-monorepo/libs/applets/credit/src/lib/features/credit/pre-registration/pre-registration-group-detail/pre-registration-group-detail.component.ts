import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CreditPurePlan } from '../../data-access/models/credit/pre-registration/credit-plans.response';
import { CreditPlanDetailResponse } from '../../data-access/models/credit/pre-registration/credit-plan-detail.response';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditNeoWarningDialogComponent } from '../../components/credit-neo-warning-dialog/credit-neo-warning-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { PreRegistrationService } from '../services/pre-registration.service';
import { PlanRuleEnum } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditStoreBottomSheetComponent } from '../components/credit-store-bottom-sheet/credit-store-bottom-sheet.component';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { MessageService } from '../../data-access/services/message.service';

@Component({
  selector: 'app-pre-registration-group-detail',
  templateUrl: './pre-registration-group-detail.component.html',
  styleUrls: ['./pre-registration-group-detail.component.scss'],
  imports: [
    NgxButtonComponent,
    PipesModule,
    NgxIcon,
    NgxBadgeModule,
    CreditStoreBottomSheetComponent,
    NgxTrackableIdDirective,
    CreditPageLoadingComponent,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationGroupDetailComponent implements OnInit {
  showLoading = signal<boolean>(true);
  planId = signal<string | null>(null);
  selectedPlan!: CreditPurePlan;
  planDetail = signal<CreditPlanDetailResponse | null>(null);
  groupId!: string;

  private bottomSheetService = inject(NgxBottomSheetService);
  creditApiService = inject(CreditApiService);
  activatedRoute = inject(ActivatedRoute);
  preRegistrationService = inject(PreRegistrationService);
  messageService = inject(MessageService);
  pageTitle = computed(() => {
    return this.planDetail()?.serviceType === SERVICE_TYPE.BNPL ? 'جزییات اعتبار اقساطی' : 'جزییات وام';
  });
  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.planId.set(params['planId']);
    this.groupId = params['groupId'];
    this.getData();
  }

  getData(): void {
    this.showLoading.set(true);
    this.creditApiService.getPlanDetail(this.planId()!).subscribe({
      next: (response) => {
        this.planDetail.set(response);
        this.showLoading.set(false);
      },
      error: (err) => {
        this.messageService.showErrorOfErrorResponse(err);
        this.onBack();
      },
    });
  }

  changeAccordionState(title: string) {
    this.planDetail.update((detail) => {
      const updatedReceiptItems = detail?.receiptItems.map((item) => {
        if (item.title === title) {
          item.isOpen = !item.isOpen;
        }
        return item;
      });
      const updatedDescription = detail?.descriptionItems.map((item) => {
        if (item.title === title) {
          item.isOpen = !item.isOpen;
        }
        return item;
      });
      return {
        ...detail!,
        receiptItems: updatedReceiptItems!,
        descriptionItems: updatedDescription!,
      };
    });
  }

  submitForm(): void {
    if (this.selectedPlan && this.selectedPlan.display && !this.selectedPlan.display.usability) {
      this.showWarningDialog(this.selectedPlan.display.title!, this.selectedPlan.display.message!);
      return;
    }

    const balanceRange = this.planDetail()?.card.planRuleType === PlanRuleEnum.DYNAMIC ? this.planDetail()?.card.balanceRange : undefined;
    const queryParams = {
      balance: balanceRange?.min,
      serviceType: this.planDetail()?.serviceType,
    };

    this.preRegistrationService.goToRegisterForm(this.planId()!, this.groupId, queryParams);
  }

  onBack(): void {
    this.preRegistrationService.goToSelectPlan();
  }

  private showWarningDialog(title: string, message: string): void {
    this.bottomSheetService.openBottomSheet(CreditNeoWarningDialogComponent, {
      title,
      secondDesc: message || 'متاسفانه این طرح را نمی‌توانید انتخاب کنید. لطفا طرح دیگری را انتخاب کنید',
      pictorial: true,
      buttonText: 'متوجه شدم',
    });

    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      this.preRegistrationService.goToSelectPlan();
    });
  }
}
