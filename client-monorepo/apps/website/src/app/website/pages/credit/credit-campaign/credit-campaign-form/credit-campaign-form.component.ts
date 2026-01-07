import { Component, Input } from '@angular/core';
import { ContactForm } from '../../../../../api/clients/models/templates/contact-us/contact-form';
import { FormModal } from '../../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { ContactFormComponent } from '../../../../../ui/ui-components/ui-contact/contact-form/contact-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-credit-campaign-form',
  templateUrl: './credit-campaign-form.component.html',
  styleUrls: ['./credit-campaign-form.component.scss'],
  standalone: true,
  imports: [NgIf, ContactFormComponent],
})
export class CreditCampaignFormComponent {
  @Input() title = '';

  @Input() subtitle = '';

  @Input() contactForm!: ContactForm;

  @Input() mainFormModal: FormModal;
}
