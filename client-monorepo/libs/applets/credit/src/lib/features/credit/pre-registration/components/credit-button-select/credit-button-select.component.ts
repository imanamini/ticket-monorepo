import { ChangeDetectionStrategy, Component, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CreditButtonSelectOption } from './credit-button-select-option';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-button-select',
  templateUrl: './credit-button-select.component.html',
  styleUrls: ['./credit-button-select.component.scss'],
  standalone: true,
  imports: [NgxChipComponent, NgxTooltipDirective, NgxTrackableIdDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditButtonSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditButtonSelectComponent implements ControlValueAccessor {
  options = input<CreditButtonSelectOption[]>([]);
  collapsed = input<boolean>();
  loading = signal<boolean | null>(null);
  selectedValue = signal<any>(null);

  constructor() {
    effect(
      () => {
        const options = this.options();
        if (options) {
          this.loading.set(true);
          setTimeout(() => {
            this.loading.set(false);
          }, 0);
        }
      },
      { allowSignalWrites: true },
    );
  }

  propagateChange = (_: any) => {};
  propagateTouch = () => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.selectedValue.set(obj);
    }
  }

  onClick(opt: CreditButtonSelectOption) {
    if (opt.disabled) {
      return;
    }
    this.selectedValue.set(opt.value);
    setTimeout(() => {
      this.propagateChange(opt.value);
      this.propagateTouch();
    }, 0);
  }

  toggleTooltip(opt: CreditButtonSelectOption) {
    if (opt.tooltipType === 'open') {
      opt.tooltipType = 'close';
    } else {
      opt.tooltipType = 'open';
    }
  }
}
