import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { WalletManagementDescriptionConfig } from '../../data-access/models/wallet-management-description-config';

@Component({
  selector: 'wallet-mng-applet-description-stepper',
  templateUrl: './description-stepper.component.html',
  styleUrls: ['./description-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  standalone: true,
})
export class DescriptionStepperComponent {
  @Input() set config(value: WalletManagementDescriptionConfig) {
    if (!value) {
      return;
    }
    this.configValue = value;
    this.description = value.descriptionEnum[0];
  }

  @Output() readAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  configValue!: WalletManagementDescriptionConfig;
  description!: string;

  public next(): void {
    const index = this.configValue.descriptionEnum.findIndex((item) => item === this.description);
    this.description = this.configValue.descriptionEnum[index + 1];
  }

  public previous(): void {
    const index = this.configValue.descriptionEnum.findIndex((item) => item === this.description);
    this.description = this.configValue.descriptionEnum[index - 1];
  }

  public done(): void {
    new this.configValue.stateHandler().setState();
    this.readAll.emit(true);
  }
}
