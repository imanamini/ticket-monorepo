import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CreditRootStyleService } from '../../../shared/services/credit-root-style.service';
import { BnplPayFrictionComponent } from '../bnpl-pay-friction/bnpl-pay-friction.component';

@Component({
  selector: 'app-bnpl-pay-one-without-cash',
  standalone: true,
  imports: [
    BnplPayFrictionComponent
  ],
  templateUrl: './bnpl-pay-one-without-cash.component.html',
  styleUrl: './bnpl-pay-one-without-cash.component.scss'
})
export class BnplPayOneWithoutCashComponent implements OnInit, OnDestroy {

  private StyleService = inject(CreditRootStyleService);

  ngOnInit() {
    this.StyleService.setBackgroundColor('#F2F5F8');
  }

  ngOnDestroy() {
    this.StyleService.setBackgroundColor('');
  }
}
