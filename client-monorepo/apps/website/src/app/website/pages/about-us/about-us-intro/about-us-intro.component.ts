import { Component, Input } from '@angular/core';
import { AboutUsTemplateData } from '../../../../api/clients/models/templates/about-us/about-us-template-data';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-about-us-intro',
  templateUrl: './about-us-intro.component.html',
  styleUrls: ['./about-us-intro.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class AboutUsIntroComponent {
  @Input()
  templateData: AboutUsTemplateData | null = null;
}
