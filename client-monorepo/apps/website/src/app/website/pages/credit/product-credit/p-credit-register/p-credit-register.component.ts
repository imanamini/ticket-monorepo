import { Component, Input } from '@angular/core';
import { CreditProductPageTemplate } from '../../../../../api/clients/models/templates/credit/credit-product-page.response';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-p-credit-register',
  templateUrl: './p-credit-register.component.html',
  styleUrls: ['./p-credit-register.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class PCreditRegisterComponent {
  @Input()
  templateData: CreditProductPageTemplate | null = null;
}
