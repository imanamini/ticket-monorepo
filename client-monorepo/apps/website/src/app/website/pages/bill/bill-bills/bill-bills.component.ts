import { Component, Input } from '@angular/core';
import { Bills } from '../../../../api/clients/models/templates/bill/bill-template-data';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-bill-bills',
  templateUrl: './bill-bills.component.html',
  styleUrls: ['./bill-bills.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class BillBillsComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  bills!: Bills[];
}
