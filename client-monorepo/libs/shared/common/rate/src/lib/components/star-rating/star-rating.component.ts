import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'common-rate-star-rating',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  stars = signal<number[]>([0, 0, 0, 0, 0]);
  starsSelected = output<number>();

  handleRateClick(selectedIndex: number): void {
    const newArray: number[] = this.stars().map((item, index) => (index <= selectedIndex ? 1 : 0));
    this.stars.set([...newArray]);
    this.starsSelected.emit(selectedIndex + 1);
  }
}
