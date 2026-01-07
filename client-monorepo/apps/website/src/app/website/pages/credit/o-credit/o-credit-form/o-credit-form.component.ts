import { Component, Input } from '@angular/core';
import { ApiFile } from '../../../../../api/clients/models/common/api-file';
import { ContactForm } from '../../../../../api/clients/models/templates/contact-us/contact-form';
import { ContactFormComponent } from '../../../../../ui/ui-components/ui-contact/contact-form/contact-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-o-credit-form',
  templateUrl: './o-credit-form.component.html',
  styleUrls: ['./o-credit-form.component.scss'],
  standalone: true,
  imports: [NgIf, ContactFormComponent],
})
export class OCreditFormComponent {
  @Input() title = '';

  @Input() subtitle = '';

  @Input() description = '';

  @Input() image!: ApiFile;

  @Input() contactForm!: ContactForm;
}
