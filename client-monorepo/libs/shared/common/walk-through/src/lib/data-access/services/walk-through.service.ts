import { ApplicationRef, ComponentRef, computed, createComponent, inject, Injectable, signal } from '@angular/core';
import { DefaultWalkThroughConfig, WalkThroughConfig, WalkthroughEvent, WalkThroughStep } from '../models/walk-through-config';
import { WalkThroughComponent } from '../../components/walk-through/walk-through.component';
import { StorageService } from '@client-monorepo/common/utilities';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalkThroughService {
  isWalkThroughVisible = signal(false);
  config = signal<WalkThroughConfig>({ ...DefaultWalkThroughConfig });
  activeStep = computed<WalkThroughStep>(() => {
    const steps = this.config().steps();
    if (this.selectorClickSubscription) {
      this.selectorClickSubscription.unsubscribe();
    }
    return steps.find((s) => s.isActive()) as WalkThroughStep;
  });
  walkthroughRoutes: string[] = [];
  baseZIndexes: Record<string, string> = {};
  isWorking = false;
  firstImpression = true;

  selectorClickSubscription!: Subscription;
  appRef = inject(ApplicationRef);
  storageService = inject(StorageService);
  router = inject(Router);
  closingInterval!: NodeJS.Timeout;
  openingTimeouts: Array<NodeJS.Timeout> = [];
  walkThroughComponentRef!: ComponentRef<WalkThroughComponent>;
  event = signal<WalkthroughEvent | undefined>(undefined);

  manageWalkThrough(configs: WalkThroughConfig[]): void {
    this.fillWalkthroughRoutes(configs);
    if (this.storageService.isLoggedIn() && this.shouldStart(configs)) {
      this.subscribeOnRouteChange(configs);
    } else {
      return;
    }
  }

  fillWalkthroughRoutes(configs: WalkThroughConfig[]): void {
    const uniqueWalkThroughRoutes = new Set<string>();
    configs.forEach((config) => {
      uniqueWalkThroughRoutes.add(config.startRoute);
      config.steps().forEach((step) => {
        if (step.route) uniqueWalkThroughRoutes.add(step.route);
      });
    });
    this.walkthroughRoutes = Array.from(uniqueWalkThroughRoutes);
  }

  subscribeOnRouteChange(configs: WalkThroughConfig[]): void {
    if (this.firstImpression) {
      this.firstImpression = false;

      for (const config of configs) {
        const [shouldContinue, shouldSet] = this.chooseActiveConfig(config);
        if (shouldContinue) {
          continue;
        }
        if (shouldSet) {
          this.config.set(config);
          this.decideToShowConfig();
          break;
        }
      }
    }
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (!this.walkthroughRoutes.includes(this.router.url)) {
        this.close('destroyImmediate');
      }
      if (this.isWorking && this.config().startRoute !== 'all') {
        this.goToUnstableState();
      }

      for (const config of configs) {
        const [shouldContinue, shouldSet] = this.chooseActiveConfig(config);
        if (shouldContinue) {
          continue;
        }
        if (shouldSet) {
          this.config.set({ ...config });
          this.decideToShowConfig();
          break;
        }
      }
    });
  }

  chooseActiveConfig(config: WalkThroughConfig): [boolean, boolean] {
    if (this.isCompleted(config)) {
      return [true, false];
    }
    if (config.startRoute === 'all' || config.startRoute === this.router.url) {
      return [false, true];
    }
    return [true, false];
  }

  shouldStart(configs: WalkThroughConfig[]): boolean {
    let shouldStartVariable = false;
    if (this.isWorking) {
      return false;
    }
    for (const config of configs) {
      if (!this.isCompleted(config)) {
        shouldStartVariable = true;
      }
    }
    return shouldStartVariable;
  }

  removeInvalidSteps(): WalkThroughConfig {
    const config = { ...this.config() };
    const mustRemoveIds: number[] = [];
    for (const step of config.steps()) {
      const elem = this.findHostElement(step);
      if (!elem) {
        const index = config.steps().indexOf(step);
        mustRemoveIds.push(index);
        if (step?.isFirst) {
          if (config.steps() && config.steps().length > 1) {
            const nextStepIndex = index + 1;
            const steps = config.steps();

            if (steps[nextStepIndex]) {
              steps[nextStepIndex].isFirst = true;

              if (steps.length === 2) {
                steps[nextStepIndex].isLast = true;
              }
            }
          } else {
            this.done();
          }
        }
        if (step.isLast) {
          if (config.steps().length > 1) {
            config.steps()[index - 1].isLast = true;
          } else {
            this.done();
          }
        }

        if (step.isActive()) {
          if (config.steps().length - 1 > index) {
            config.steps()[index + 1].isActive.set(true);
          } else {
            this.done();
          }
        }
      }
    }
    for (const id of mustRemoveIds) {
      config.steps().splice(id, 1);
    }
    return { ...config };
  }

  findHostElement(step: WalkThroughStep): HTMLElement {
    if (step.selectorElement.selectorType === 'class') {
      return document.getElementsByClassName(step.selectorElement.selector)[0] as HTMLElement;
    } else {
      return document.getElementById(step.selectorElement.selector) as HTMLElement;
    }
  }

  decideToShowConfig(): void {
    if (!this.isWorking && !this.isCompleted(this.config())) {
      const timeoutForShow = setTimeout(() => {
        if (this.isWorking) {
          this.goToUnstableState();
          return;
        }
        this.config.set({ ...this.removeInvalidSteps() });
        if (this.config().steps().length === 0) {
          return;
        }

        const walkThroughState = this.storageService.getWalkThroughSate(this.config().rootElementId);
        this.isWorking = true;
        const conditionErrorState = this.show();
        if (!conditionErrorState) {
          return;
        }
        if (walkThroughState) {
          this.goToStep(+walkThroughState);
        }
      }, this.config().delay);
      this.openingTimeouts.push(timeoutForShow);
    }
  }

  show(): boolean {
    const config = this.config();
    if (config.startRoute !== 'all' && config.startRoute !== this.router.url) {
      return false;
    }
    const hostElement = document.getElementById(config.rootElementId) as HTMLElement;
    if (!hostElement) {
      return false;
    }
    this.walkThroughComponentRef = createComponent(WalkThroughComponent, { hostElement, environmentInjector: this.appRef.injector });
    this.appRef.attachView(this.walkThroughComponentRef.hostView);
    this.walkThroughComponentRef.changeDetectorRef.detectChanges();
    this.isWalkThroughVisible.set(true);
    return true;
  }

  close(closeReason: 'close' | 'done' | 'destroyImmediate' = 'close'): void {
    if (this.walkThroughComponentRef) {
      this.walkThroughComponentRef.destroy();
    }
    this.baseZIndexes = {};
    if (this.config().routeAfterEnd && closeReason !== 'destroyImmediate') {
      this.router.navigate([this.config().routeAfterEnd]).then();
    }
    if (this.selectorClickSubscription) {
      this.selectorClickSubscription.unsubscribe();
    }
    this.isWorking = false;
    this.isWalkThroughVisible.set(false);
    this.setEvent(closeReason);
  }

  goNext(): void {
    try {
      const oldActiveIndex = this.config().steps().indexOf(this.activeStep());
      this.config().steps()[oldActiveIndex].isActive.set(false);
      const newActiveIndex = oldActiveIndex + 1;
      this.config().steps()[newActiveIndex].isActive.set(true);
      this.storageService.setWalkThroughSate(this.config().rootElementId, this.config().steps()[newActiveIndex].id.toString());
      this.setEvent('next');
    } catch {
      this.done();
      this.setEvent('done');
    }
  }

  goPrev(): void {
    const activeIndex = this.config().steps().indexOf(this.activeStep());
    this.config().steps()[activeIndex].isActive.set(false);
    this.config().steps()[activeIndex - 1].isActive.set(true);
    this.setEvent('prev');
  }

  goToStep(id: number): void {
    const activeIndex = this.config().steps().indexOf(this.activeStep());
    try {
      this.config().steps()[activeIndex].isActive.set(false);
      const stepIndex = this.config()
        .steps()
        .findIndex((s) => s.id === id);
      if (stepIndex !== -1) {
        this.config().steps()[stepIndex].isActive.set(true);
      } else {
        this.done();
      }
    } catch {
      this.done();
    }
  }

  done(): void {
    this.storageService.setWalkThroughSate(this.config().rootElementId, 'done');
    this.close('done');
  }

  isCompleted(config: WalkThroughConfig): boolean {
    const walkThroughState = this.storageService.getWalkThroughSate(config.rootElementId);
    return !!(walkThroughState && walkThroughState === 'done');
  }

  goToUnstableState(): void {
    if (!this.closingInterval) {
      this.closingInterval = setInterval(() => {
        const hostElement = document.getElementById(this.config().rootElementId);
        if (!hostElement) {
          this.close();
        }
        let element;
        if (this.activeStep()) {
          if (this.activeStep() && this.activeStep().selectorElement.selectorType === 'class') {
            element = document.getElementsByClassName(this.activeStep().selectorElement.selector)[0];
          } else {
            element = document.getElementById(this.activeStep().selectorElement.selector);
          }
        }

        if (!element) {
          this.close();
        }
      }, 100);
    }
    for (const timeout of this.openingTimeouts) {
      clearTimeout(timeout);
    }
  }

  setEvent(name: 'close' | 'done' | 'next' | 'prev' | 'destroyImmediate'): void {
    this.event.set({
      name,
      activeStepId: this.activeStep() ? this.activeStep().id : 0,
      configRootElementId: this.config().rootElementId,
    });
  }
}
