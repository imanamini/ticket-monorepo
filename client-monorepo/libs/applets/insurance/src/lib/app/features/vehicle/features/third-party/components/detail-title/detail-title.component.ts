import { Component, input } from '@angular/core';

@Component({
  selector: 'detail-title',
  standalone: true,
  imports: [],
  templateUrl: './detail-title.component.html',
  styleUrl: './detail-title.component.scss'
})
export class DetailTitleComponent {

  constructor() {
  }

  title = input.required<string>();
  subTitle = input<string>();
}
