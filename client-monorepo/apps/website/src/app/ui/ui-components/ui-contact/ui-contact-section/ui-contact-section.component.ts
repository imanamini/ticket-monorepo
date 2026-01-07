import { Component, Input, TemplateRef } from '@angular/core';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-contact-section',
  templateUrl: './ui-contact-section.component.html',
  styleUrls: ['./ui-contact-section.component.scss'],
  standalone: true,
  imports: [NgIf, NgTemplateOutlet, ContactFormComponent],
})
export class UiContactSectionComponent {
  @Input()
  title!: string;

  @Input()
  description!: string;

  @Input()
  notice!: string;

  @Input()
  contactForm: ContactForm | undefined;

  @Input()
  switchBtn!: TemplateRef<any>;
}
