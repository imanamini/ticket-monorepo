import { Component, input, output } from '@angular/core';
import { InsButtonComponent } from '../ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';

@Component({
  selector: 'empty-result',
  standalone: true,
  imports: [InsButtonComponent],
  templateUrl: './empty-result.component.html',
  styleUrl: './empty-result.component.scss'
})
export class EmptyResultComponent {
  title = input<string>('');
  icon = input<string>('');
  description = input<string>('');
  actionButton = input<boolean>(false);
  actionButtonText = input<string>('');
  actionButtonIcon = input<string>();
  actionButtonStyle = input<InsButtonStyleEnum>(InsButtonStyleEnum.Fill);
  actionButtonClicked = output<Event>();

  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  handleButtonClicked(e: Event): void {
    this.actionButtonClicked.emit(e);
  }
}
