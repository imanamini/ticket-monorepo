import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleComponent } from '../simple/simple.component';
import { UpcomingComponent } from '../upcoming/upcoming.component';
import { JmMode, NextAction, NextActionType } from '@client-monorepo/common/journey-management';

@Component({
  selector: 'common-journey-management-jm-factory',
  standalone: true,
  imports: [CommonModule, SimpleComponent, UpcomingComponent],
  templateUrl: './jm-factory.component.html',
  styleUrl: './jm-factory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JmFactoryComponent {
  mode = input<JmMode>(JmMode.NEXT_ACTION);
  data = input.required<NextAction>();

  protected readonly NextActionType = NextActionType;
}
