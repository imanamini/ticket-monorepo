import { Component } from '@angular/core';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { WorkingCapitalKybWrapperComponent } from './components/working-capital-kyb-wrapper/working-capital-kyb-wrapper.component';

@Component({
  selector: 'app-working-capital-kyb',
  templateUrl: './working-capital-kyb.component.html',
  styleUrls: ['./working-capital-kyb.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, WorkingCapitalKybWrapperComponent],
})
export class WorkingCapitalKybComponent {}
