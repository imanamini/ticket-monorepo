import { Component } from '@angular/core';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-report-intro',
  templateUrl: './report-intro.component.html',
  styleUrls: ['./report-intro.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class ReportIntroComponent {}
