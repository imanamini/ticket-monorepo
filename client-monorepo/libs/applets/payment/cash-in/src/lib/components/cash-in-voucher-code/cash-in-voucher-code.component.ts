import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import {UppercaseDirective} from '../../data-access/directives/uppercase.directive';

@Component({
  selector: 'cash-in-applet-cash-in-voucher-code',
  templateUrl: './cash-in-voucher-code.component.html',
  styleUrls: ['./cash-in-voucher-code.component.scss'],
  standalone: true,
  imports: [UiFormFieldBuilderModule, FormsModule, UppercaseDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashInVoucherCodeComponent {
  @Input()
  code!: string;

  @Input()
  codeHasError!: boolean;

  @Output()
  codeChange = new EventEmitter();

  onCodeChange($event: any) {
    this.codeChange.emit($event);
  }

  inputKeyDown($event: any) {
    if ($event.code.toLowerCase() === 'space') {
      $event.preventDefault();
    }
  }
}
