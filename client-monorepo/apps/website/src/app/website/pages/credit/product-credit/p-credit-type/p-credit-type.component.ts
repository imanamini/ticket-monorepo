import { Component, Input } from '@angular/core';
import { CreditProductPageTemplate } from '../../../../../api/clients/models/templates/credit/credit-product-page.response';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-p-credit-type',
  templateUrl: './p-credit-type.component.html',
  styleUrls: ['./p-credit-type.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class PCreditTypeComponent {
  @Input()
  templateData: CreditProductPageTemplate | null = null;
}
