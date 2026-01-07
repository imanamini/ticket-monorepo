import { Component, Input } from '@angular/core';
import { BnplCustomers } from '../../../../../api/clients/models/templates/o-bnpl/o-bnpl-template-data';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-o-bnpl-customers',
  templateUrl: './o-bnpl-customers.component.html',
  styleUrls: ['./o-bnpl-customers.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class OBnplCustomersComponent {
  @Input()
  title: string | undefined = '';

  @Input()
  invite: string | undefined = '';

  @Input()
  customers: BnplCustomers[] | undefined = [];
}
