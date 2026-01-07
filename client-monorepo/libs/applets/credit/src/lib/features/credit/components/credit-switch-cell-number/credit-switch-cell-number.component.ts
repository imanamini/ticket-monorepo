import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Dir } from '@angular/cdk/bidi';
import { CreditScrollableViewComponent } from '../credit-scrollable-view/credit-scrollable-view.component';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';

@Component({
  selector: 'app-credit-switch-cell-number',
  templateUrl: './credit-switch-cell-number.component.html',
  styleUrls: ['./credit-switch-cell-number.component.scss'],
  standalone: true,
  imports: [CreditScrollableViewComponent, Dir, NgxButtonComponent, NgxTrackableIdDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSwitchCellNumberComponent implements OnInit {
  title = 'شماره همراه خود را تغییر دهید';

  fromCellNumber = input<string>();
  toCellNumber = input<string>();

  serviceTypeName = signal('');

  switchCellNumber = output();
  cancelSwitch = output();

  private creditServiceTypeService = inject(CreditServiceTypeService);

  ngOnInit() {
    this.serviceTypeName.set(this.creditServiceTypeService.isBnpl() ? 'اعتبار' : 'وام');
  }

  onSwitchCellNumber() {
    this.switchCellNumber.emit();
  }

  onCancelSwitch() {
    this.cancelSwitch.emit();
  }
}
