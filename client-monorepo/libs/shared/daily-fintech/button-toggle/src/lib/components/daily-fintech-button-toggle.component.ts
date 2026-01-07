import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ButtonToggleInterface } from '../data-access/model/button-toggle.model';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'daily-fintech-button-toggle',
  standalone: true,
  imports: [CommonModule, DpIconComponent, ApiImageModule],
  templateUrl: './daily-fintech-button-toggle.component.html',
  styleUrl: './daily-fintech-button-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechButtonToggleComponent {
  // Injects
  private messageService = inject(MessageService);

  // Signals
  options = input<ButtonToggleInterface[]>([]);
  selectedOption = input<ButtonToggleInterface | null>(null);
  enabled = input(true);
  /**
   * To show snackbar
   */
  message = input('');
  @ViewChild('switchOptions')
  switchOptionsRef!: ElementRef<HTMLUListElement>;
  toggleChange = output<ButtonToggleInterface | null>();

  optionClick(index: number) {
    const option = this.options()[index];
    if (!this.enabled || !option?.isActive) {
      if (!this.message()) {
        return;
      }
      return this.messageService.showSuccessMessage(this.message());
    }
    this.toggleChange.emit(option);
  }
}
