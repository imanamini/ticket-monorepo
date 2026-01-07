import { Component, input, output, signal } from '@angular/core';
import {
  ActionButtonsComponent
} from '../../../../../../components/action-buttons/action-buttons.component';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';

@Component({
  selector: 'motor-info-box',
  standalone: true,
  imports: [
    ActionButtonsComponent
  ],
  templateUrl: './motor-info-box.component.html',
  styleUrl: './motor-info-box.component.scss'
})
export class MotorInfoBoxComponent extends ThirdPartyMotorDirective {
  text = input<string>('');
  activeButtonText = input<string>('تایید و ادامه');
  deActiveButtonText = input<string>('مرحله قبل');
  showStepper = input<boolean>(true);
  showPlate = input<boolean>(false); // Motors typically don't show car plates
  showHeader = input<boolean>(true);

  activeButtonClicked = output<Event>();
  deActiveButtonClicked = output<Event>();

  plate = signal<string | null>(null);

  protected onNext(event: string): void {
    this.activeButtonClicked.emit(null);
  }

  protected override onPrevious(): void {
    this.deActiveButtonClicked.emit(null);
  }

  protected onClose(): void {
    this.closeService.close();
  }
}
