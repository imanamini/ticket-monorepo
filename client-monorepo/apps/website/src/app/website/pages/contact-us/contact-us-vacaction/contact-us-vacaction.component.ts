import { Component, Input } from '@angular/core';
import { ContactUsTemplate } from '../../../../api/clients/models/templates/contact-us/contact-us-template';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-us-vacaction',
  templateUrl: './contact-us-vacaction.component.html',
  styleUrls: ['./contact-us-vacaction.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ContactUsVacactionComponent {
  @Input()
  templateData: ContactUsTemplate | null = null;
}
