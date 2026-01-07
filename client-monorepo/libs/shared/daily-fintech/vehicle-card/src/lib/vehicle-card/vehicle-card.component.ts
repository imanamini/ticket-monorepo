import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleCardStatus } from '../data-access/models/vehicle-card-action-section';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { VehicleCardStatusToCtaMap } from '../data-access/models/vehicle-card-status-to-cta-map';
import { vehicleCardStatusToCtaMapConst } from '../data-access/constants/vehicle-card-status-to-cta-map.const';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-vehicle-card',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxPlateComponent, NgxButtonComponent],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  name = input<string>('خودرو من');
  plate = input<string>('');
  paymentAmount = input<number>(0);
  paymentAmountLabel = input<string>('مبلغ قابل پرداخت');
  showPaymentAmount = input<boolean>(true);
  paymentAmountAlternativeMessage = input<string>('');
  infoMessage = input<string>('');
  noServiceErrorMessage = input<string>('خطا در استعلام');
  status = input<VehicleCardStatus>('no-service');
  loading = input<boolean>(false);
  edit = output<void>();
  ctaClick = output<MouseEvent>();
  retryClicked = output<MouseEvent>();
  statusToCtaMap: VehicleCardStatusToCtaMap = vehicleCardStatusToCtaMapConst;

  editVehicle(): void {
    this.edit.emit();
  }

  onCtaClick($event: MouseEvent) {
    if (this.status() === 'no-service') {
      this.retryClicked.emit($event);
      return;
    }
    this.ctaClick.emit($event);
  }
}
