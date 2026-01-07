import { Component, EventEmitter, Output } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { UiSectionComponent } from '../../../../../../ui/ui-components/ui-section/ui-section/ui-section.component';
import { WorkingCapitalKybFormComponent } from '../working-capital-kyb-form/working-capital-kyb-form.component';
import { WorkingCapitalKybInProgressComponent } from '../working-capital-kyb-in-progress/working-capital-kyb-in-progress.component';

@Component({
  selector: 'app-working-capital-kyb-wrapper',
  templateUrl: './working-capital-kyb-wrapper.component.html',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, UiSectionComponent, WorkingCapitalKybFormComponent, WorkingCapitalKybInProgressComponent],
  styleUrls: ['./working-capital-kyb-wrapper.component.scss'],
})
export class WorkingCapitalKybWrapperComponent {
  cellNumber = '';

  state: 'FORM' | 'IN_PROGRESS' = 'FORM';

  @Output() errorType = new EventEmitter();

  dataMapper = {
    FORM: {
      title: 'برای تعیین سقف اعتبار، اطلاعات زیر را تکمیل کنید.',
    },
  };
}
