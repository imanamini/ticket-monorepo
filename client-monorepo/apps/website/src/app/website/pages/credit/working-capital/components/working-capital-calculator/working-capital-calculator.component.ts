import {Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import { PlanGroup } from '../../../../../../ui/models/credit/credit-plan-group';
import { UiComplexAccordion } from '../../../../../../ui/ui-components/ui-complex-accordion/model/ui-complex-accordion';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { Subscription } from 'rxjs';
import { WorkingCapitalFormDialogComponent } from '../working-capital-form-dialog/working-capital-form-dialog.component';
import { MerchantsApiService, PreRegisterErrorResponse, VOLUNTEER_STATES } from '../../../../../../api/clients/credit/merchants-api.service';
import { PreRegisterRequest } from '../../../../../../api/clients/credit/pre-register.request';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { MessageService } from '@client-monorepo/common/utilities';
import { WorkingCapitalPlansData } from './working-capital-plans.data';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiComplexAccordionComponent } from '../../../../../../ui/ui-components/ui-complex-accordion/ui-complex-accordion/ui-complex-accordion.component';
import {isPlatformBrowser, NgIf} from '@angular/common';
import { CreditCalculatorV3Component } from '../../../../../../ui/ui-components/ui-credit/credit-calculator-v3/credit-calculator-v3.component';

@Component({
  selector: 'app-working-capital-calculator',
  templateUrl: './working-capital-calculator.component.html',
  styleUrls: ['./working-capital-calculator.component.scss'],
  standalone: true,
  imports: [CreditCalculatorV3Component, NgIf, UiComplexAccordionComponent, UiButtonComponent],
})
export class WorkingCapitalCalculatorComponent implements OnInit {
  @Input() creditAmount: number;
  @Input() showFundProviderIcon = false;
  @Input() showInterestPercentage = false;
  @Output() error = new EventEmitter<{
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  }>();

  @Output() emitResponse = new EventEmitter<PlanGroup>();
  help: UiComplexAccordion = {
    icon: {
      path: '/2023/08/36a48e4b-d665-43fd-b309-0f0e8877e754.svg',
      url: 'https://www.mydigipay.com/api/website/proxy/get-file/public/2023/08/36a48e4b-d665-43fd-b309-0f0e8877e754.svg',
      name: '36a48e4b-d665-43fd-b309-0f0e8877e754.svg',
      altText: '36a48e4b-d665-43fd-b309-0f0e8877e754.svg',
    },
    title: 'شرایط و مدارک مورد نیاز',
    subtitle: null,
    items: [
      {
        type: 3,
        payload: {
          icon: null,
          steps: [
            {
              title: null,
              description:
                '<ul>\n' +
                '<li>کارت ملی هوشمند (یا کارت ملی قدیمی به همراه رسید کارت ملی جدید)</li>\n' +
                '<li>چک صیادی بنفش به‌ نام خود متقاضی</li>\n' +
                '<li>کارت پایان خدمت یا معافیت سربازی برای آقایان</li>\n' +
                '<li>امکان ثبت نام فقط برای گروه سنی ۱۸ الی ۷۰ سال می‌باشد.</li>\n' +
                '</ul>',
            },
          ],
        },
      },
    ],
    ctaIcon: null,
    firstCta: {
      icon: null,
      id: null,
      title: null,
      link: null,
    },
    secondCta: {
      icon: null,
      id: null,
      title: null,
      link: null,
    },
  };
  @Input() plans: PlanGroup[] = WorkingCapitalPlansData;

  @Input() showAllPlan = false;

  filteredPlans: PlanGroup[] = [];
  sub: Subscription;
  selectedPlanData: any;



  constructor(
    private dialog: DialogBottomSheetService,
    private merchantsApiService: MerchantsApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    if (!this.showAllPlan) {
      for (const plan of this.plans) {
        if (this.creditAmount >= plan.creditAmount) {
          this.filteredPlans.push(plan);
        }
      }
    } else {
      for (const plan of this.plans) {
        this.filteredPlans.push(plan);
      }
    }
  }

  onShowDetailLoan() {
    this.dialog.open(WorkingCapitalFormDialogComponent, {
      width: 420,
      fullHeightBottomSheet: true,
      selectedPlan: this.selectedPlanData[0],
    });
    this.sub = this.dialog.afterCloseData.subscribe((response) => {
      if (response) {
        this.onSubmit(response);
        this.emitResponse.emit(response);
      }
    });
  }

  onSubmit(payload: any) {
    this.sub.unsubscribe();
    this.route.queryParams.subscribe((params) => {
      if (params.birthDate && params.nationalCode) {
        const merchant: PreRegisterRequest = {
          birthDate: params.birthDate,
          nationalCode: params.nationalCode,
          planId: payload.planId,
          groupId: payload.groupId,
        };
        if(isPlatformBrowser(this.platformId)){
          this.goToCredit(merchant).then();
        }
      }
    });
  }

  goToCredit(payload: PreRegisterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.merchantsApiService.registerCreditJourney(payload).subscribe(
        (response) => {
          switch (response.result.state) {
            case VOLUNTEER_STATES.REGISTERED:
              resolve();
              window.location.href = `${environment.appUrl}/hub?rt=service/credit/wallet/activation/steps/${response.result.fundProviderCode}/${response.result.creditId}`
              break;
            case VOLUNTEER_STATES.REGISTRATION_FAILED:
              this.showOpenCreditFileError();
              break;
            case VOLUNTEER_STATES.DUPLICATE_CELL_NUMBER:
              this.showDuplicateCellNumberError();
              break;
            case VOLUNTEER_STATES.DUPLICATE_NATIONAL_ID:
              this.showDuplicateNationalCodeError(response.result.cellNumber);
              break;
            default:
          }
        },
        (e: PreRegisterErrorResponse | any) => {
          if (e && e.messages && e.messages.length > 0) {
            const errors = {};
            e.messages.forEach((m) => {
              errors[m.fieldName] = m.text;
            });
            reject(errors);
          }

          this.messageService.showErrorOfErrorResponse(e);
        },
      );
    });
  }

  selectedPlan(selectedPlanData: any) {
    this.selectedPlanData = selectedPlanData;
  }

  private showDuplicateCellNumberError() {
    const error = {
      title: 'شما پرونده وام باز در دیجی‌پی دارید.',
      subtitle: 'با شماره  موبایل  وارد شده، در دیجی‌پی درخواست وام داده شده است.',
      description: 'وارد اپ دیجی‌پی شوید و وضعیت درخواست خود را مشاهده کنید.',
      ctaText: 'وضعیت درخواست',
      ctaLink: `${environment.appUrl}/hub?rt=service/credit/overview`,
    };
    this.error.emit(error);
  }

  private showDuplicateNationalCodeError(cellNumber: string) {
    const error = {
      title: 'شما پرونده وام باز در دیجی‌پی دارید.',
      subtitle: `پرونده اعتباری دیگری با این کدملی و شماره همراه ${cellNumber} ساخته شده است.`,
      description: 'وارد اپ دیجی‌پی شوید و وضعیت درخواست خود را مشاهده کنید.',
      ctaText: 'وضعیت درخواست',
      ctaLink: `${environment.appUrl}/home?rt=service/credit/overview`,
    };
    this.error.emit(error);
  }

  private showOpenCreditFileError() {
    const error = {
      title: 'شما پرونده وام باز در دیجی‌پی دارید.',
      subtitle: 'با شماره  موبایل  وارد شده، در دیجی‌پی درخواست وام داده شده است.',
      description: 'وارد اپ دیجی‌پی شوید و وضعیت درخواست خود را مشاهده کنید.',
      ctaText: 'وضعیت درخواست',
      ctaLink: `${environment.appUrl}/hub?rt=service/credit/overview`,
    };
    this.error.emit(error);
  }
}
