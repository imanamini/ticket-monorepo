import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PlanGroup } from '../../../../models/credit/credit-plan-group';
import { NumberToStringPipe } from '../../../../ui-pipes/number-to-string.pipe';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiButtonComponent } from '../../../ui-button/ui-button/ui-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UiScrollableViewComponent } from '../../../ui-scrollable-view/ui-scrollable-view.component';
import { UiIconDirective } from '../../../../ui-directive/ui-icon.directive';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-pre-register-cheque-confirm',
  templateUrl: './pre-register-cheque-confirm.component.html',
  styleUrls: ['./pre-register-cheque-confirm.component.scss'],
  standalone: true,
  imports: [
    UiScrollableViewComponent,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    UiButtonComponent,
    UiIconDirective,
    PipesModule,
    NumberToStringPipe,
    NgxCheckboxComponent,
    NgxIcon,
  ],
})
export class PreRegisterChequeConfirmComponent {
  @Input() step: any;
  @Input() collateral: any;
  @Input() selectedPlanGroup: PlanGroup;

  @Output() onBack = new EventEmitter();
  @Output() onNext = new EventEmitter();

  accepted = signal<boolean>(false);
  warningShake: boolean;

  back() {
    this.onBack.emit();
  }

  next() {
    this.onNext.emit();
  }
}
