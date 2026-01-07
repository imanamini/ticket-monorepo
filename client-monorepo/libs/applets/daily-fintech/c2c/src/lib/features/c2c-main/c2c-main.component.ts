import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bank, BankCard } from '@client-monorepo/daily-fintech/bank-card';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { C2cStepsEnum } from '../../data-access/models/c2c-steps';
import { C2cCredentialsStepComponent } from '../c2c-credentials-step/c2c-credentials-step.component';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { C2cNewCardStepComponent } from '../c2c-new-card-step/c2c-new-card-step.component';
import { C2cSourceCardStepComponent } from '../c2c-source-card-step/c2c-source-card-step.component';
import { C2cDestinationCardStepComponent } from '../c2c-destination-card-step/c2c-destination-card-step.component';
import { C2C_STEPS } from '../../data-access/constants/c2c-steps';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'c2c-applet-c2c-main',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    C2cCredentialsStepComponent,
    C2cNewCardStepComponent,
    C2cSourceCardStepComponent,
    C2cDestinationCardStepComponent,
  ],
  templateUrl: './c2c-main.component.html',
  styleUrls: ['./c2c-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cMainComponent implements OnInit, OnDestroy {
  // Injects
  private readonly bottomNavigationService = inject(NgxBottomNavigationService);
  private readonly c2cStateService = inject(C2cStateService);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly routeStateService = inject(RouteStateService);

  cards = computed<BankCard[]>(() => this.c2cStateService.sourceStoredCards());
  allBanks = computed<Bank[]>(() => this.c2cStateService.allBanks());
  activeStepIndex = computed<number>(() => this.c2cStateService.activeStepIndex());

  ngOnInit() {
    this.bottomNavigationService.hide();
    // Trigger data fetching
    this.c2cMainService
      .initializeC2c()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const cards = this.c2cStateService.sourceStoredCards();
          if (cards && cards.length > 0) {
            this.checkReturnFromShaparakToVerify();
          }
        },
      });
  }

  private checkReturnFromShaparakToVerify(): void {
    const state = this.routeStateService.getAll();
    // Handle Shaparak failure
    if (state?.shaparakState === 'failed') {
      this.messageService.showErrorMessage('ثبت کارت با خطا مواجه شد، لطفا کارت دیگری را امتحان کنید');
      return;
    }
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
    this.c2cStateService.resetC2cState();
  }

  protected readonly C2C_STEPS = C2C_STEPS;
  protected readonly C2cStepsEnum = C2cStepsEnum;
}
