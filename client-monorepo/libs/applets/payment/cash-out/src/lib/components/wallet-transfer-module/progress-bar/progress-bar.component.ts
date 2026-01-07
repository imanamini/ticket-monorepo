import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent{
  value = input(0);
  contextColor = input('#e5e5e5') ;
  progressColor = input('#00cc6d') ;
}
