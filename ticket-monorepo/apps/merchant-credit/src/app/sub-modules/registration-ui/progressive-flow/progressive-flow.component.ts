import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { ProgressStepDirective } from './progress-step.directive';
import { ProgressContentDirective } from './progress-content.directive';

@Component({
  selector: 'progressive-flow',
  templateUrl: './progressive-flow.component.html',
  styleUrls: ['./progressive-flow.component.scss']
})
export class ProgressiveFlowComponent implements OnInit {

  @Input()
  stepTitles: string[] = [];

  @Input()
  stepSubTitles: number[] = [];

  @Input()
  stepIndex = 0;

  @ContentChildren(ProgressStepDirective)
  steps!: QueryList<ProgressStepDirective>;

  @ContentChildren(ProgressContentDirective)
  stepContent!: QueryList<ProgressContentDirective>;

  indexTranslations = [
    'اول',
    'دوم',
    'سوم',
    'چهارم',
    'پنجم',
    'ششم',
    'هفتم',
    'هشتم',
    'نهم',
    'دهم',
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
