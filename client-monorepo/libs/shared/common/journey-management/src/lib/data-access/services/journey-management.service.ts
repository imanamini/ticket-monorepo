import { Injectable, signal } from '@angular/core';
import { DisplayState, NextActionWithState } from '@client-monorepo/common/journey-management';

@Injectable({
  providedIn: 'root',
})
export class JourneyManagementService {
  nextActions = signal<NextActionWithState[]>([]);
  mainActionId = signal('');
  mainActionDisplayState = signal<DisplayState>('pending');
  otherActionDisplayState = signal<DisplayState>('pending');
  allActionsDone = signal(false);

  setDisplayState(id: string, state: DisplayState) {
    this.nextActions.update((nextActions: NextActionWithState[]) => {
      return nextActions.map((na) => {
        if (na.id === id) {
          na.displayState = state;
        }
        return na;
      });
    });
    this.updateGlobalState(id, state);
  }

  updateGlobalState(currentId: string, currentState: DisplayState): void {
    const allJobsDone = this.nextActions().find((na) => na.displayState !== 'hidden');
    if (!allJobsDone) {
      this.allActionsDone.set(true);
    }
    if (currentId === this.mainActionId()) {
      this.mainActionDisplayState.set(currentState);
    }

    const otherActions = this.nextActions().filter((na) => na.id !== this.mainActionId());
    const otherJobsDone = otherActions.some((na) => na.displayState !== 'pending');
    if (otherJobsDone) {
      const atLeastOneJobAvailable = otherActions.some((na) => na.displayState === 'visible');
      if (atLeastOneJobAvailable) {
        this.otherActionDisplayState.set('visible');
      } else {
        this.otherActionDisplayState.set('hidden');
      }
    }
  }

  resetState(): void {
    this.nextActions.set([]);
    this.mainActionId.set('');
    this.mainActionDisplayState.set('pending');
    this.otherActionDisplayState.set('pending');
    this.allActionsDone.set(false);
  }
}
