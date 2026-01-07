import { Component, Input, output } from '@angular/core';
import { JourneyActionResultDataModel } from './models/journey-action-result-data.model';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../../../data-access/enums/ins-button-mode.enum';

@Component({
  selector: 'journey-action-result',
  templateUrl: './journey-action-result.component.html',
  standalone: true,
  imports: [
    InsButtonComponent
  ],
  styleUrls: ['./journey-action-result.component.scss']
})
export class JourneyActionResultComponent {

  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;

  actionButtonClicked = output();

  @Input()
  data: JourneyActionResultDataModel;

  constructor() {
  }

}
