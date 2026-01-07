import { Component, Input } from '@angular/core';
import { AboutUsTemplateData } from '../../../../api/clients/models/templates/about-us/about-us-template-data';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-about-us-vision',
  templateUrl: './about-us-vision.component.html',
  styleUrls: ['./about-us-vision.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class AboutUsVisionComponent {
  @Input()
  templateData: AboutUsTemplateData | null = null;
}
