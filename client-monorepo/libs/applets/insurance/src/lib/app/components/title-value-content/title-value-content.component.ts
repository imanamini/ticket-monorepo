import { Component, input } from '@angular/core';

import { TitleValueContentDataModel } from '../../data-access/models/title-value-content-data.model';
import { NgClass } from '@angular/common';
import { NgxPlateComponent } from '@digipay/ngx-plate';

@Component({
  selector: 'title-value-content',
  standalone: true,
  imports: [
    NgClass,
    NgxPlateComponent
  ],
  templateUrl: './title-value-content.component.html',
  styleUrl: './title-value-content.component.scss'
})
export class TitleValueContentComponent {
  data = input.required<TitleValueContentDataModel>();
  styleClass = input<string>();
}
