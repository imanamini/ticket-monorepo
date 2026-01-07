import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CashOutProcessService } from '../../services/cash-out-process.service';

@Component({
  selector: 'footer-with-currency',
  templateUrl: './footer-with-currency.component.html',
  styleUrls: ['./footer-with-currency.component.scss']
})
export class FooterWithCurrencyComponent implements OnInit {
  @Input() disabled = true;
  @Input() loadingApi = false;
  @Input() submitText: string;
  @Output() submit: EventEmitter<undefined> = new EventEmitter();
  public selectedUserAmount: number;
  private registerCashOutService = inject(CashOutProcessService);

  ngOnInit(): void {
    this.selectedUserAmount = this.registerCashOutService.getSelectedUserAmount();
  }

}
