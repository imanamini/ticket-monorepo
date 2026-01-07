import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { catchError, finalize, forkJoin, of, throwError } from 'rxjs';
import { PageLoadingComponent } from '../../components/page-loading/page-loading.component';
import { PageLoadingService } from '../../components/page-loading/page-loading.service';
import { IssuanceDetail } from '../../data-access/models/digi-card-issuance-response.interface';
import { DigiCardIssuanceStatus, DigiCardIssuanceStep } from '../../data-access/models/digi-card-issuance.enum';
import { DigiCardIssuanceService } from '../../data-access/services/digi-card-issuance.service';
import { stepToRoute } from '../../data-access/utils/issuance-step-soute-mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'digipay-card-applet-card-issuance',
  standalone: true,
  imports: [CommonModule, PageLoadingComponent],
  templateUrl: './card-issuance.component.html',
  styleUrl: './card-issuance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardIssuanceComponent {
  pageLoadingService = inject(PageLoadingService);
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  messageService = inject(MessageService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  digiCardIssuanceStatus = DigiCardIssuanceStatus;

  ngOnInit() {
    this.checkRedirectSource();
  }
  checkRedirectSource() {
      const source =this.activeRoute.snapshot.params['source'];
      if (source) {
        this.getIssuanceProcessDetail(true);
      } else {
        this.getIssuanceProcessDetail(false);
      }
  }
  getIssuanceProcessDetail(skipSub: boolean) {
    this.pageLoadingService.showLoading();
    this.digiCardIssuanceService
      .getIssueProcesses()
      .pipe(
        finalize(() => {
          if (!skipSub) {
            this.pageLoadingService.hideLoading();
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (res) {
            const currentStep = res.status === this.digiCardIssuanceStatus.NOT_INITIATED ? 0 : res.currentStep;
            this.digiCardIssuanceService.issuanceDetail.set({
              currentStep: currentStep,
              nextStep: res.nextStep,
              status: res.status,
            });
            const { address, nationalCode, birthDate, name, deathStatus, postalCode } = res;
            this.digiCardIssuanceService.addressDetail.set({
              address,
              nationalCode,
              birthDate,
              name,
              deathStatus,
              postalCode,
            });

            this.navigateToIssuanceStep(
              {
                status: res.status,
                currentStep: currentStep,
                nextStep: res.nextStep,
              },
              skipSub,
            );
          }
        },
        error: (err) => {
          if (err?.error?.result?.status === 18513) {
            const stepData: IssuanceDetail = { currentStep: 0, nextStep: 1, status: DigiCardIssuanceStatus.PENDING };
            this.digiCardIssuanceService.issuanceDetail.set(stepData);
            this.navigateToIssuanceStep(stepData);
            return;
          }
          this.messageService.showErrorMessage(err?.error?.result?.message);
          this.router.navigateByUrl('/transactions');
        },
      });
  }
  navigateToIssuanceStep(detail: IssuanceDetail, skipSub?: boolean) {
    switch (detail.currentStep) {
      case DigiCardIssuanceStep.KYC:
        this.router.navigateByUrl(stepToRoute[DigiCardIssuanceStep.KYC]!, { replaceUrl: true });
        break;

      case DigiCardIssuanceStep.PLAN_APPROVED:
        this.handlePlanStep(skipSub);
        break;

      case DigiCardIssuanceStep.BIOMETRICS:
        this.router.navigateByUrl(stepToRoute[DigiCardIssuanceStep.BIOMETRICS]!, { replaceUrl: true });
        break;

      case DigiCardIssuanceStep.ADDRESS:
        this.router.navigateByUrl(stepToRoute[DigiCardIssuanceStep.ADDRESS]!, { replaceUrl: true });
        break;

      default:
        this.router.navigateByUrl(stepToRoute[DigiCardIssuanceStep.CUSTOMER_CREATION]!, { replaceUrl: true });
        break;
    }
  }
  handlePlanStep(skipSub?: boolean) {
    forkJoin({
      requiredPlan: this.digiCardIssuanceService.getRequiredPlan(),
      userPlan: this.digiCardIssuanceService.getUserPlan().pipe(
        catchError((err) => {
          if (err?.status === 422) {
            return of({ plan: null });
          }
          return throwError(() => err);
        }),
      ),
    }).subscribe({
      next: ({ requiredPlan, userPlan }) => {
        this.digiCardIssuanceService.requiredPlans.set(requiredPlan.plans);
        this.digiCardIssuanceService.userPlan.set(userPlan.plan ?? null);

        if (!userPlan || !userPlan.plan) {
          this.router.navigateByUrl('/card/issuance/subscription-required');
          return;
        }
        const hasRequiredPlan = requiredPlan.plans.some((p) => p.type === userPlan.plan?.type);

        if (!hasRequiredPlan) {
          this.router.navigateByUrl('/card/issuance/subscription-change');
          return;
        }
        if (skipSub) {
          this.confirmPlan();
          return;
        }
        this.router.navigate(['/card/issuance/subscription-active'], { queryParams: this.activeRoute.snapshot.queryParams });
      },
      error: (err) => {
        this.router.navigateByUrl('/transactions');
      },
    });
  }
  confirmPlan() {
    this.digiCardIssuanceService.confirmPlan().subscribe({
      next: (res) => {
        this.getIssuanceProcessDetail(false);
      },
      error: (err) => {
        this.messageService.showErrorMessage(err?.error?.result?.message);
      },
    });
  }
}
