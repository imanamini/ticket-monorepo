import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { PlateModel } from '../../data-access/models/third-party/plate/plate.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';

@Component({
  selector: 'plate-card',
  standalone: true,
  imports: [
    InsIconComponent,
    NgxPlateComponent,
  ],
  templateUrl: './plate-card.component.html',
  styleUrl: './plate-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlateCardComponent {
  protected readonly IconEnum = IconEnum;

  simple = input<boolean>(false);

  plateInfo = input<PlateModel>();

  moreClicked = output<PlateModel>();

  handleMoreIconClick($event): void {
    $event.stopPropagation();
    this.moreClicked.emit(this.plateInfo());
  }
}
