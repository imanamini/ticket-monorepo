import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Recommendation} from '../../../data-access/models/recommendation.model';
import {ApiImageModule} from '@digipay/ng-ui-api-image';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {ColorService} from '../../../data-access/services/color.service';

@Component({
  selector: 'cash-out-applet-recommendation-list-item',
  templateUrl: './recommendation-list-item.component.html',
  styleUrls: ['./recommendation-list-item.component.scss'],
  standalone: true,
  imports: [
    ApiImageModule,
    NgStyle,
    NgClass,
    NgIf
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecommendationListItemComponent {

  @Input()
  item!: Recommendation;

  @Input()
  showMore: boolean = false;

  @Input()
  clickable: boolean = true;

  @Output()
  itemClick = new EventEmitter<any>();

  imgLoadError = false;

  constructor(
    private colorService: ColorService,
  ) {
  }

  convertItemColorToRgb() {
    return this.colorService.getRGB(this.item.color);
  }

  emitClick($event: any) {
    let el = $event.target as HTMLDivElement;
    if (!(el.classList.contains('more') && $event.target.tagName)) {
      this.itemClick.emit(this.item);
    }
    return;
  }

  moreIconClick() {

  }

  imageLoadError(e: any) {
    this.imgLoadError = true;
  }

}
