import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseJmRendererComponent,
  BaseJourney,
  DisplayState,
  GraphicType,
  JmConfig,
  JmMode,
  JourneyManagementService,
  NextAction,
  NextActionGraphic,
} from '@client-monorepo/common/journey-management';

@Component({
  selector: 'common-journey-management-simple',
  standalone: true,
  imports: [CommonModule, BaseJmRendererComponent],
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleComponent {
  // Inputs
  data = input.required<NextAction>();
  jmMode = input<JmMode>(JmMode.NEXT_ACTION);

  // Variables
  jmConfig = computed<JmConfig>(() => {
    return { mode: this.jmMode(), data: this.baseJourneyData() as BaseJourney };
  });
  baseJourneyData = computed(() => this.generateBaseJourneyData(this.data()));

  displayState = signal<DisplayState>('pending');
  journeyManagementService = inject(JourneyManagementService);

  generateBaseJourneyData(nAction: NextAction): BaseJourney {
    this.setDisplayState('visible');
    return {
      title: nAction?.payload?.title,
      description: nAction?.payload?.subTitle,
      secondaryDescription: nAction?.payload?.description,
      primaryAction: {
        text: nAction?.payload?.primaryAction?.actionData.title ?? 'برو',
        action: nAction?.payload?.primaryAction,
      },
      secondaryActions: nAction?.payload?.secondaryActions?.map((secondaryAction) => {
        return {
          text: secondaryAction?.actionData.title ?? '',
          action: secondaryAction,
        };
      }),
      badges: [],
      stepper: this.generateBaseDataStepper(nAction),
      image: this.generateBaseDataImage(nAction),
      backgroundImage: this.generateBackgroundImage(nAction),
      foregroundImage: this.generateForeGroundImage(nAction),
    };
  }

  generateBaseDataStepper(action: NextAction): { title?: string; percentage: number } | undefined {
    if (
      action?.payload?.graphic?.type === GraphicType.GAUGE_CHART &&
      action?.payload?.graphic.currentStep &&
      action?.payload?.graphic.totalStep
    ) {
      const graphic: NextActionGraphic = action?.payload?.graphic as NextActionGraphic;
      return {
        title: `مرحله ${graphic.currentStep} از ${graphic.totalStep}`,
        percentage: ((graphic?.currentStep ?? 1) / (graphic?.totalStep ?? 1)) * 100,
      };
    } else {
      return undefined;
    }
  }

  generateBaseDataImage(action: NextAction): string | undefined {
    if (action?.payload?.graphic?.type === GraphicType.PICTURE && action?.payload?.graphic?.fileId) {
      const graphic: NextActionGraphic = action?.payload?.graphic as NextActionGraphic;
      return graphic?.fileId;
    } else {
      return undefined;
    }
  }

  generateBackgroundImage(action: NextAction): string | undefined {
    if (action?.payload?.graphic?.background) {
      const graphic: NextActionGraphic = action?.payload?.graphic as NextActionGraphic;
      return graphic?.background;
    } else {
      return undefined;
    }
  }

  generateForeGroundImage(action: NextAction): string | undefined {
    if (action?.payload?.graphic?.foreground) {
      const graphic: NextActionGraphic = action?.payload?.graphic as NextActionGraphic;
      return graphic?.foreground;
    } else {
      return undefined;
    }
  }

  setDisplayState(state: DisplayState) {
    setTimeout(() => {
      this.displayState.set(state);
      this.journeyManagementService.setDisplayState(String(this.data()?.id), state);
    });
  }
}
