import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CreditCollateralInfoModel } from '../pre-registration-step-collateral/credit-collateral-info.model';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-pre-registration-step-confirm-plan',
  templateUrl: './pre-registration-step-confirm-plan.component.html',
  styleUrls: ['./pre-registration-step-confirm-plan.component.scss'],
  imports: [
    FormsModule,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxCheckboxComponent,
    PipesModule,
    CreditScrollableViewComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepConfirmPlanComponent implements OnInit {
  infoMapper: { [key: string]: CreditCollateralInfoModel } = {};
  plans!: PlanGroup[];
  accepted = signal<boolean>(false);
  warningShake = signal<boolean | null>(null);
  info = signal<{ title: string; amount: number }[]>([]);
  creditAmount = signal<number | null>(null);
  loading = signal(false);

  private preRegistrationService = inject(PreRegistrationService);

  ngOnInit(): void {
    this.preRegistrationService.unsetFilters(['collateralType']);
    this.plans = this.preRegistrationService.filteredPlans;
    this.initiateData();
  }

  initiateData(): void {
    this.infoMapper = {};
    this.plans
      .sort((a, b) => {
        if (a.collateralDto.name < b.collateralDto.name) {
          return 1;
        }
        if (a.collateralDto.name > b.collateralDto.name) {
          return -1;
        }
        return 0;
      })
      .forEach((item) => {
        const collateralType = this.preRegistrationService.collateralType.getValue();
        if (item.collateralDto.type === collateralType) {
          this.creditAmount.set(item.creditAmount);
          const sumInstallmentAmount = {
            title: 'مجموع اقساط',
            amount: item.sumInstallmentAmount,
          };
          const allocationPrepaymentAmount = {
            title: 'هزینه خدمات و زیرساخت',
            amount: item.allocationPrepaymentAmount,
          };
          const payableAmount = {
            title: 'کل بازپرداخت',
            amount: item.payableAmount,
          };
          this.info.update((info: any) => [...info, sumInstallmentAmount, allocationPrepaymentAmount, payableAmount]);
        }
      });
  }

  back(): void {
    this.preRegistrationService.prevStep();
  }

  backToSelectPlan(): void {
    this.preRegistrationService.activeStepIndex.next(0);
  }

  onSubmit(): void {
    if (!this.accepted) {
      this.runWarningShake();
      return;
    }
    this.loading.set(true);
    this.preRegistrationService.setFilters({
      collateralType: this.preRegistrationService.collateralType.getValue(),
    });
    this.preRegistrationService.nextStep();
  }

  runWarningShake(): void {
    this.warningShake.set(true);
    setTimeout(() => {
      this.warningShake.set(false);
    }, 400);
  }
}
