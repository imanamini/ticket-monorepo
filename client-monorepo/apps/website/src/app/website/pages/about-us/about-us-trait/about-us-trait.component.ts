import { Component, Input } from '@angular/core';
import { AboutUsTemplateData } from '../../../../api/clients/models/templates/about-us/about-us-template-data';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-about-us-trait',
  templateUrl: './about-us-trait.component.html',
  styleUrls: ['./about-us-trait.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class AboutUsTraitComponent {
  @Input()
  templateData: AboutUsTemplateData | null = null;
}
