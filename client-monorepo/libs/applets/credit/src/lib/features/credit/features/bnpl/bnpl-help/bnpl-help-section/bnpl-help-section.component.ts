import { Component, input } from '@angular/core';
import { BnplHelpSection } from '../data/models/bnpl-help-section';
import { NgClass } from '@angular/common';
import { LandingElementComponent } from '../landing-element/landing-element.component';

@Component({
  selector: 'ui-bnpl-help-section',
  templateUrl: './bnpl-help-section.component.html',
  styleUrls: ['./bnpl-help-section.component.scss'],
  standalone: true,
  imports: [NgClass, LandingElementComponent],
})
export class BnplHelpSectionComponent {
  section = input<BnplHelpSection>();
}
