import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ThirdPartyStepperComponent } from '../third-party-stepper/third-party-stepper.component';
import { BaseComponent } from '../../../../../../components/base/base.component';
import {
  ActionButtonsComponent
} from '../../../../../../components/action-buttons/action-buttons.component';
import { PlateService } from '../../data-access/services/plate.service';
import { CloseService } from '../../../../data-access/services/shared/close.service';
import { NgxPlateComponent } from '@digipay/ngx-plate';

@Component({
  selector: 'car-info-box',
  standalone: true,
  imports: [
    ThirdPartyStepperComponent,
    ActionButtonsComponent,
    NgxPlateComponent
  ],
  templateUrl: './car-info-box.component.html',
  styleUrl: './car-info-box.component.scss'
})
export class CarInfoBoxComponent extends BaseComponent implements OnInit {

  private plateService = inject(PlateService);
  private closeService = inject(CloseService);

  constructor() {
    super();
  }

  text = input<string>('');
  activeButtonText = input<string>('تایید و ادامه');
  deActiveButtonText = input<string>('مرحله قبل');
  showStepper = input<boolean>(true);
  showPlate = input<boolean>(true);
  showHeader = input<boolean>(true);

  activeButtonClicked = output<Event>();
  deActiveButtonClicked = output<Event>();

  plate = signal<string | null>(null);

  ngOnInit(): void {
    this.getPlate();
  }

  getPlate(): void {
    super.addSubscription(this.plateService.getPlate().subscribe({
      next: res => {
        this.plate.set(res ?? null);
      }
    }));
  }

  handleActiveButtonClicked(e: Event): void {
    this.activeButtonClicked.emit(e);
  }

  handleDeActiveButtonClicked(e: Event): void {
    this.deActiveButtonClicked.emit(e);
  }

  handleCloseClicked(): void {
    this.closeService.close();
  }
}
