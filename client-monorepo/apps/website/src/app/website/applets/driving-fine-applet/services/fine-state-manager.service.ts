import { NewPlateFineStates, SelectPlateFineStates } from '../driving-fine-applet/car-fine-states';
import { UserService } from '../../../../core/services/user.service';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UiDialogLoginComponent } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FineStateManagerService {
  states = [
    {
      type: NewPlateFineStates.CAR_INFO_ENTERING,
      needAuth: false,
    },
    {
      type: NewPlateFineStates.INQUIRY_METHOD_SELECT,
      needAuth: true,
      prevSkip: true,
    },
    {
      type: NewPlateFineStates.INQUIRY_COST_PAYMENT,
      prevSkip: true,
      needAuth: true,
    },
    {
      type: NewPlateFineStates.FINE_PAYMENT,
      needAuth: true,
    },
    {
      type: NewPlateFineStates.FINE_PAYMENT_RESULT,
    },
  ];

  savedPlatesStates = [
    {
      type: SelectPlateFineStates.VEHICLE_INFO_ENTERING,
      needAuth: false,
    },
    {
      type: SelectPlateFineStates.SAVED_PLATES_LIST,
      needAuth: false,
    },
  ];

  currentStateIndex: BehaviorSubject<number> = new BehaviorSubject(0);

  public selectedStateType: BehaviorSubject<NewPlateFineStates | SelectPlateFineStates> = new BehaviorSubject<
    NewPlateFineStates | SelectPlateFineStates
  >(NewPlateFineStates.CAR_INFO_ENTERING);

  constructor(
    private userService: UserService,
    private dialog: DialogBottomSheetService,
  ) {
    this.currentStateIndex.subscribe((newStateIndex) => {
      this.selectedStateType.next(this.states[newStateIndex].type);
    });
  }

  nextStep() {
    if (this.currentStateIndex.getValue() >= this.states.length - 1) {
      return;
    }

    if (this.doesNextStepNeedsAuth()) {
      if (this.isNotLoggedIn()) {
        this.dialog.open(UiDialogLoginComponent, {});
        return;
      }
    }

    this.currentStateIndex.next(this.currentStateIndex.getValue() + 1);
  }

  previousStep() {
    if (this.currentStateIndex.getValue() <= 0) {
      return;
    }

    this.currentStateIndex.next(this.currentStateIndex.getValue() - 1);

    if (this.states[this.currentStateIndex.getValue()].prevSkip) {
      this.previousStep();
    }
  }

  isNotLoggedIn(): boolean {
    return !this.userService.isLoggedIn.getValue();
  }

  doesNextStepNeedsAuth(): boolean {
    return this.states[this.currentStateIndex.getValue() + 1].needAuth;
  }

  jumpToCertainState(certainState: NewPlateFineStates) {
    this.currentStateIndex.next(certainState);
  }
}
