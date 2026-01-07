import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
  WritableSignal
} from '@angular/core';
import { PlateCardComponent } from '../plate-card/plate-card.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { PlateApiService } from '../../data-access/services/third-party/plate-api.service';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { BaseComponent } from '../../../../components/base/base.component';
import { InsButtonModeEnum } from '../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { PlateModel } from '../../data-access/models/third-party/plate/plate.model';
import { EnterPlateDataModel } from '../../features/third-party/components/enter-plate/models/enter-plate-data.model';
import { IconEnum } from '../../../../data-access/enums/icon.enum';

@Component({
  selector: 'my-plates',
  standalone: true,
  imports: [
    PlateCardComponent,
    InsIconComponent,
    NgxSkeletonLoadingComponent
  ],
  templateUrl: './my-plates.component.html',
  styleUrl: './my-plates.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPlatesComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  private plateApiService = inject(PlateApiService);

  simple = input<boolean>(false);
  selectPlate = output<EnterPlateDataModel>();

  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  readonly IconEnum = IconEnum;
  platesList: WritableSignal<Array<PlateModel>> = signal([]);
  showPlatesListLoading: WritableSignal<boolean> = signal(true);

  ngOnInit(): void {
    this.loadPlatesList();
  }

  loadPlatesList(): void {
    this.showPlatesListLoading.set(true);
    super.addSubscription(this.plateApiService.getPlates().subscribe({
      next: platesResponse => {
        this.platesList.set(platesResponse.result);
        this.showPlatesListLoading.set(false);
      }
    }));
  }

  handlePlateClick(plateData: EnterPlateDataModel): void {
    this.selectPlate.emit(plateData);
  }

}
