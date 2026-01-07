import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Step } from '../../data-access/models/credit/activation/step.model';
import { CREDIT_STEP_STATE } from './credit-step.model';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-step',
  templateUrl: './credit-step.component.html',
  styleUrls: ['./credit-step.component.scss'],
  standalone: true,
  imports: [NgxTrackableIdDirective, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStepComponent {
  step = input<Step>();

  progressValue = input<string>();

  progressMeta = input<string>();

  editButton = input(false);

  open = input(false);

  stepTitleClass = computed(() => {
    if (
      this.step()?.open ||
      [CREDIT_STEP_STATE.ERROR, CREDIT_STEP_STATE.WARNING].includes(this.step()?.state!.toLowerCase() as CREDIT_STEP_STATE)
    ) {
      return 'st-3 text-onback-high';
    }
    if (this.step()?.state?.toLowerCase() === CREDIT_STEP_STATE.SUCCESS) {
      return 'b-1 text-onback-disabled';
    }
    return 'b-1 text-onback-medium';
  });

  stepError = computed(() => this.step()!.state!.toLowerCase() === CREDIT_STEP_STATE.ERROR);
  stepWarning = computed(() => this.step()!.state!.toLowerCase() === CREDIT_STEP_STATE.WARNING);
  noBorder = computed(() => this.stepError() || this.stepWarning());

  headerClick = output<Step>();

  clicked() {
    this.headerClick.emit(this.step()!);
  }

  protected readonly CREDIT_STEP_STATE = CREDIT_STEP_STATE;
}
