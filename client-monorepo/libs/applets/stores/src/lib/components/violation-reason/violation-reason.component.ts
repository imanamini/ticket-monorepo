import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ViolationPaymentMethodsTitleMapper,
  ViolationPurchaseStatus,
  ViolationReasonSummaryFields,
  ViolationReasonSummaryMapper,
  ViolationReasonTitleMapper,
  ViolationReasonTitles,
} from '../../data-access/constants/violation.const';
import { ViolationReasonModel, ViolationReasonSummaryModel } from '../../data-access/models/violation.model';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ViolationService } from '../../data-access/services/violation.service';

@Component({
  selector: 'stores-applet-violation-reason',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    NgxChipComponent,
    ApiImageComponent,
    NgxDividerComponent,
    PipesModule,
    NgxIcon,
    NgxButtonComponent,
  ],
  templateUrl: './violation-reason.component.html',
  styleUrl: './violation-reason.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationReasonComponent implements OnInit {
  // Injections
  violationService = inject(ViolationService);

  // Input
  reasonsSummary = computed<ViolationReasonSummaryModel>(() => {
    const service = this.violationService;
    return {
      status: service.purchaseStatus(),
      store: service.guaranteedStore()?.title,
      storeImageId: service.guaranteedStore()?.logoImageId,
      referrerMethodTitle: ViolationPaymentMethodsTitleMapper[service.paymentMethod()!],
      date: service.purchase()?.activityExerciseDate,
      price: service.purchase()?.activityAmount,
    };
  });

  // Variables
  protected readonly String = String;
  protected readonly ViolationReasonSummaryFields = ViolationReasonSummaryFields;
  summaryTitleClass = 'c-3 text-onback-low';
  summaryValueClass = 'c-1 text-onback-medium';
  reasonsToShow = computed<ViolationReasonModel[]>(() => this.generateReasonsToShow());
  selectedReason = signal<string | undefined>(undefined);
  summariesToShow = computed<ViolationReasonSummaryFields[]>(() => this.generateSummariesToShow());
  buttonText = signal('ادامه');
  numberOfSelectedReasons = computed(() => this.violationService.reasons()?.length ?? 0);

  ngOnInit(): void {
    this.resetState();
  }

  resetState(): void {
    this.violationService.reasons.set([]);
    Object.values(ViolationReasonTitleMapper).forEach((reason) => {
      reason.items.forEach((item) => {
        item.clicked = false;
      });
    });
  }

  handleChipClick(clicked: boolean, reason: ViolationReasonModel, chip: { text: string; clicked: boolean }): void {
    this.selectedReason.set([reason.title, chip.text].join(' - '));
    if (clicked) {
      chip.clicked = true;
      this.violationService.reasons.update((ex) => {
        if (!ex) ex = [];
        ex.push(this.selectedReason()!);
        return [...ex];
      });
    } else {
      chip.clicked = false;
      this.violationService.reasons.update((ex) => {
        const index = this.violationService.reasons()?.indexOf(this.selectedReason()!);
        if (index !== undefined && index != -1) {
          ex?.splice(index, 1);
        }
        return ex ? [...ex] : [];
      });
    }
  }

  handleButtonClick(): void {
    this.violationService.nextStep();
  }

  generateReasonsToShow(): ViolationReasonModel[] {
    const purchaseStatus = this.reasonsSummary()?.status;
    if (!purchaseStatus) return [];
    const baseReasons = [
      ViolationReasonTitleMapper[ViolationReasonTitles.FINANCIAL_ISSUES],
      ViolationReasonTitleMapper[ViolationReasonTitles.OTHER],
    ];
    if (purchaseStatus! === ViolationPurchaseStatus.PURCHASED) {
      return [
        ViolationReasonTitleMapper[ViolationReasonTitles.ORDER_STATUS],
        ViolationReasonTitleMapper[ViolationReasonTitles.PACKAGE_ISSUES],
        ...baseReasons,
      ];
    }
    return [ViolationReasonTitleMapper[ViolationReasonTitles.PAYMENT_GATEWAY_ISSUES], ...baseReasons];
  }

  generateSummariesToShow(): ViolationReasonSummaryFields[] {
    const status = this.reasonsSummary()?.status;
    if (!status) return [];
    return ViolationReasonSummaryMapper[status];
  }
}
