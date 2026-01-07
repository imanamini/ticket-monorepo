import { Component, input } from '@angular/core';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { ContactFormComponent } from '../../../../ui/ui-components/ui-contact/contact-form/contact-form.component';

@Component({
  selector: 'app-bpg-form',
  templateUrl: './bpg-form.component.html',
  styleUrls: ['./bpg-form.component.scss'],
  standalone: true,
  imports: [ContactFormComponent],
})
export class BpgFormComponent {
  title = input<string>('');
  subtitle = input<string>('');
  description = input<string>('');
  image = input<ApiFile>();
  contactForm = input<ContactForm>();
}
