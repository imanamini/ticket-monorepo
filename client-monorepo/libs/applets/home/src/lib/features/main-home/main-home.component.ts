import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsSliderComponent } from '@client-monorepo/common/user-assets';
import {
  GracefulJourneyComponent,
  JmFactoryComponent,
  JmMode,
  JourneyManagementApiService,
  JourneyManagementService,
  MainActionSkeletonComponent,
  NextAction,
  NextActionPosition,
  NextActionWithState,
  OtherActionsSkeletonComponent,
} from '@client-monorepo/common/journey-management';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { SelectedServicesPreviewComponent } from '@client-monorepo/common/app-services';
import { AppService, FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { InitiatorService } from '@client-monorepo/common/utilities';
import { map } from 'rxjs';
import { FrequentTransactionsSummaryComponent } from '@client-monorepo/applets/transactions';

@Component({
  selector: 'home-applet-main-home',
  standalone: true,
  imports: [
    CommonModule,
    AssetsSliderComponent,
    TitleSummaryComponent,
    JmFactoryComponent,
    SelectedServicesPreviewComponent,
    NgxDividerComponent,
    JmFactoryComponent,
    MainActionSkeletonComponent,
    OtherActionsSkeletonComponent,
    GracefulJourneyComponent,
    FrequentTransactionsSummaryComponent,
  ],
  templateUrl: './main-home.component.html',
  styleUrl: './main-home.component.scss',
})
export class MainHomeComponent implements OnInit, OnDestroy {
  mainAction = signal<NextAction | undefined>(undefined);
  mainActionDisplayState = computed(() => this.jmService.mainActionDisplayState());
  otherActions = signal<NextActionWithState[] | undefined>(undefined);
  otherActionsDisplayState = computed(() => this.jmService.otherActionDisplayState());

  protected readonly JmMode = JmMode;
  appServiceService = inject(AppService);
  services = signal<Array<FrequentServiceInterface>>([]);
  servicesLoading = signal<boolean>(true);
  allActionsDone = computed(() => this.jmService.allActionsDone());
  initiatorService = inject(InitiatorService);
  jmApiService = inject(JourneyManagementApiService);
  jmService = inject(JourneyManagementService);
  BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    this.initiatorService.initiate();
    this.getNextActions();
    this.getAppServices();
  }

  ngOnDestroy(): void {
    this.jmService.resetState();
  }

  getNextActions(): void {
    this.jmApiService
      .getNextActions()
      .pipe(
        map((res): NextActionWithState[] =>
          res.nextActions.map((na) => {
            return { ...na, displayState: 'pending' };
          }),
        ),
      )
      .subscribe({
        next: (res: NextActionWithState[]) => {
          this.jmService.nextActions.set(res);
          this.distributeActions(res);
        },
        error: () => {
          this.jmService.allActionsDone.set(true);
          this.jmService.otherActionDisplayState.set('hidden');
        },
      });
  }

  distributeActions(actions: NextActionWithState[]): void {
    const tempMainAction = actions.find((a) => a.positions?.includes(NextActionPosition.TOP));
    if (!tempMainAction) {
      this.jmService.mainActionDisplayState.set('hidden');
    } else {
      this.jmService.mainActionDisplayState.set('visible');
    }
    const tempOtherActions = actions.filter((a) => a.id !== tempMainAction?.id && a.displayState !== 'hidden');
    this.mainAction.set({ ...(tempMainAction as NextAction) });
    this.jmService.mainActionId.set(this.mainAction()?.id as string);
    this.otherActions.set(tempOtherActions);
  }

  private getAppServices(): void {
    this.appServiceService.getMappedServices().subscribe({
      next: (result) => {
        this.services.set(result);
        this.servicesLoading.set(false);
      },
    });
  }
}
