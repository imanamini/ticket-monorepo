import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'ins-icon',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './ins-icon.component.html',
  styleUrl: './ins-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsIconComponent {

  name = input<IconEnum | string>();
  width = input<number>(16);
  height = input<number>(16);

  // substitution for the icon when the name was not found in the list
  iconSubstitution = input<IconEnum | string>(IconEnum.UmbrellaGray);

  handleMissingImage(): void {
    this.name = this.iconSubstitution;
  }
}
