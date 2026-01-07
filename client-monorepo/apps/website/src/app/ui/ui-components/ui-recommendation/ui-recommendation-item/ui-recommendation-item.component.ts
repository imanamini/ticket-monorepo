import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-recommendation-item',
  templateUrl: './ui-recommendation-item.component.html',
  styleUrls: ['./ui-recommendation-item.component.scss'],
  standalone: true,
  imports: [NgIf, ApiImageModule],
})
export class UiRecommendationItemComponent {
  @Input()
  mainText: string;

  @Input()
  subTitle: string;

  @Input()
  imageId: string;

  @Input()
  imageSize = 24;

  @Output()
  clicked = new EventEmitter();

  onItemClick(): void {
    this.clicked.emit();
  }
}
