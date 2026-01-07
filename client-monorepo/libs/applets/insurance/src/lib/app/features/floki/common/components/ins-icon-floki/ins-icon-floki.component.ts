import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { InsIconFlokiEnum } from './ins-icon-floki.enum';

@Component({
  selector: 'ins-icon-floki',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './ins-icon-floki.component.html',
  styleUrl: './ins-icon-floki.component.scss'
})
export class InsIconFlokiComponent {

  name = input<InsIconFlokiEnum | string>();
  width = input<number>(16);
  height = input<number>(16);

  iconSubstitution = input<InsIconFlokiEnum | string>(InsIconFlokiEnum.empty);

  handleMissingImage(): void {
    this.name = this.iconSubstitution;
  }
}
