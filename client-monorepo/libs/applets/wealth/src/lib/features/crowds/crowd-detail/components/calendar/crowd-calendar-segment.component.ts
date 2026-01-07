import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { JalaliDatePipe, PipesModule } from '@digipay/ng-lib-pipes';
import { NgxStepperComponent, StepModel } from '@digipay/ngx-stepper';
import { CrowdFundingModel } from '../../../data-access/models';

@Component({
  selector: 'app-crowd-calendar-segment',
  templateUrl: './crowd-calendar-segment.component.html',
  styleUrls: ['./crowd-calendar-segment.component.scss'],
  standalone: true,
  imports: [PipesModule, NgxStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdCalendarSegmentComponent implements OnInit {
  private jalaliDate = inject(JalaliDatePipe);

  crowd = input<CrowdFundingModel>();

  steps = signal<StepModel[] | undefined>([]);

  ngOnInit() {
    const events = this.crowd().events;
    const lastDoneIndex = events
      .slice()
      .reverse()
      .findIndex((event) => event.isDone);
    const lastIndex = lastDoneIndex !== -1 ? events.length - 1 - lastDoneIndex : -1;

    this.steps.set(
      events.map((event, index) => ({
        id: event.title,
        circleNode: {
          icon: 'history',
          type: index > lastIndex + 1 ? 'icon' : 'node',
          state: event.isDone ? 'done' : index === lastIndex + 1 ? 'current' : 'default',
        },
        connector: {
          type: 'dot',
          state: 'default',
        },
        info: {
          title: event.title,
          type: 'vertical',
          state: 'default',
          description: this.jalaliDate.transform(event.date),
          showDescription: true,
        },
      })),
    );
  }
}
