import { Component, Input } from '@angular/core';
import { TimelineSteps } from '../../../models/timeline-steps';
import { NgClass, NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-timeline',
  templateUrl: './ui-timeline.component.html',
  styleUrls: ['./ui-timeline.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
})
export class UiTimelineComponent {
  @Input()
  title = '';

  @Input()
  steps: TimelineSteps[] = [];

  @Input()
  type = 'blue';
}
