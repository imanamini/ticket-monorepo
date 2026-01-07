import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { UserInterfaceModule } from '../../../user-interface/user-interface.module';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { EsLoanStep } from '../../../api/clients/es-loan-registration/models/es-loan-step';
import { EsLoanStateModel } from '../../../api/clients/es-loan-registration/models/es-loan-get-steps.response';
import { NgxIcon } from '@digipay/ngx-icon';

enum ButtonType {
  start = 0,
  continue = 1,
  inprogress = 2
}

enum ButtonStyle {
  success = 0,
  danger = 1,
  warning = 2,
  info = 3
}

@Component({
  selector: 'es-loan-step',
  standalone: true,
  imports: [
    ApiImageModule,
    NgIf,
    UserInterfaceModule,
    NgxButtonComponent,
    NgClass,
    NgStyle,
    NgxBadgeModule,
    NgxIcon
  ],
  templateUrl: './es-loan-step.component.html',
  styleUrl: './es-loan-step.component.scss'
})

export class EsLoanStepComponent implements OnInit {

  isActive = input<boolean>(false);
  isLast = input<boolean>(false);
  isPassed = input<boolean>(false);
  step = input<EsLoanStep>();
  esLoanStateModel = input<EsLoanStateModel>();
  actionClicked = output<string>();
  badgeStatus = signal<ButtonStyle>(0);
  buttonStyleMapper: { [key in ButtonStyle]: 'success' | 'error' | 'warning' | 'info' } = {
    0: 'success',
    1: 'error',
    2: 'warning',
    3: 'info'
  };

  ngOnInit() {
    this.badgeStatus.set(this.esLoanStateModel()?.buttonStyle as ButtonStyle);
  }

  changeDescriptionColor = computed(() => {
    return this.esLoanStateModel()?.state === 'KYB_REJECT' ? 'text-onback-disabled' : 'text-onback-medium';
  });

  onButtonClick(step: string) {
    this.actionClicked.emit(step);
  }

  protected readonly ButtonType = ButtonType;
  protected readonly ButtonStyle = ButtonStyle;
}
