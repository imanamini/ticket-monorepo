import { Component, Input } from '@angular/core';
import { ContactUsTemplate } from '../../../../api/clients/models/templates/contact-us/contact-us-template';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-us-map',
  templateUrl: './contact-us-map.component.html',
  styleUrls: ['./contact-us-map.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class ContactUsMapComponent {
  @Input()
  templateData: ContactUsTemplate | null = null;
}
