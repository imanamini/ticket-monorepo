import { Component, Input } from '@angular/core';
import { FlowDefinition } from '../../../../api/clients/models/templates/services/service-page-template';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-ui-flow',
  templateUrl: './ui-flow.component.html',
  styleUrls: ['./ui-flow.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle],
})
export class UiFlowComponent {
  @Input()
  flow?: FlowDefinition;

  activeIndex = 0;

  changeActiveItem(index: number) {
    this.activeIndex = index;
  }
}
