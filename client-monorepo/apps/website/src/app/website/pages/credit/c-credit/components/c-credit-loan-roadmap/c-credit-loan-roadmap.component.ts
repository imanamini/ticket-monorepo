import { Component, Input } from '@angular/core';
import { LoanRoadmap } from '../../../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-c-credit-loan-roadmap',
  templateUrl: './c-credit-loan-roadmap.component.html',
  styleUrls: ['./c-credit-loan-roadmap.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, NgOptimizedImage],
})
export class CCreditLoanRoadmapComponent {
  @Input()
  CCreditLoanRoadmapData: LoanRoadmap;
}
