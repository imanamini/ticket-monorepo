import { Component, Input } from '@angular/core';
import { ContactForm } from '../../../../../api/clients/models/templates/contact-us/contact-form';
import { ApiFile } from '../../../../../api/clients/models/common/api-file';
import { ContactFormComponent } from '../../../../../ui/ui-components/ui-contact/contact-form/contact-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-o-bnpl-form',
  templateUrl: './o-bnpl-form.component.html',
  styleUrls: ['./o-bnpl-form.component.scss'],
  standalone: true,
  imports: [NgIf, ContactFormComponent],
})
export class OBnplFormComponent {
  @Input()
  title: string | undefined = '';

  @Input()
  description: string | undefined = '';

  @Input()
  image!: ApiFile;

  @Input()
  contactForm!: ContactForm;
}
