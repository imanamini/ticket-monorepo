import { Component, Input } from '@angular/core';
import { TimelineSteps } from '../../../../ui/models/timeline-steps';
import { CTCStatistics } from '../../../../api/clients/models/templates/card-to-card/card-to-card-template-data';
import { ButtonCta } from '../../../../ui/models/button-cta';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-card-to-card-steps',
  templateUrl: './card-to-card-steps.component.html',
  styleUrls: ['./card-to-card-steps.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, UiButtonComponent],
})
export class CardToCardStepsComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  steps: TimelineSteps[] = [];

  @Input()
  statisticsSide!: CTCStatistics;

  @Input()
  cta!: ButtonCta;
}
