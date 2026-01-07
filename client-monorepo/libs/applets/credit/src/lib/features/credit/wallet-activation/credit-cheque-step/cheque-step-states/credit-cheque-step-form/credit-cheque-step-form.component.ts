import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import moment from 'jalali-moment';
import { CreditChequeStepService } from '../../services/credit-cheque-step.service';
import { CreditChequeStepInterface } from '../../services/credit-cheque-step.interface';
import { CreditChequeStepFormBasicComponent } from './credit-cheque-step-form-basic/credit-cheque-step-form-basic.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-cheque-step-form',
  templateUrl: './credit-cheque-step-form.component.html',
  styleUrls: ['./credit-cheque-step-form.component.scss'],
  imports: [CreditChequeStepFormBasicComponent, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepFormComponent implements OnInit {
  nextStep = output();
  prevStep = output();
  today = moment().locale('fa');

  data = signal<any>(null);
  creditChequeStepService = inject(CreditChequeStepService);

  ngOnInit(): void {
    this.data.set(this.creditChequeStepService.data);
  }

  goBack(): void {
    this.prevStep.emit();
  }

  onBasicFormSubmit(basicData: CreditChequeStepInterface): void {
    this.creditChequeStepService.setData(basicData);
    this.data.set(this.creditChequeStepService.data);
    this.nextStep.emit();
  }
}
