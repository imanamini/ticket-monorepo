import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayTaxiModel, TaxiCarInfo } from '../../data-access/models/pay-taxi.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'taxi-applet-info',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxPlateComponent],
  templateUrl: './taxi-info.component.html',
  styleUrl: './taxi-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxiInfoComponent {
  @Input() taxiInfo!: TaxiCarInfo;
  @Input() taxiData!: PayTaxiModel;
}
