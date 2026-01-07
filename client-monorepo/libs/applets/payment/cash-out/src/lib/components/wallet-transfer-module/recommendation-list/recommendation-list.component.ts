import { ChangeDetectionStrategy, Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Recommendation } from '../../../data-access/models/recommendation.model';
import { RecommendationListItemComponent } from '../recommendation-list-item/recommendation-list-item.component';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
  styleUrls: ['./recommendation-list.component.scss'],
  standalone: true,
  imports: [RecommendationListItemComponent, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationListComponent {
  items = input<Recommendation[]>([]);

  @Input()
  title!: string;

  @Input()
  showMoreIcon = false;

  @Output()
  itemClick = new EventEmitter<Recommendation>();

  itemClickHandler(item: Recommendation) {
    this.itemClick.emit(item);
  }
}
