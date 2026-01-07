import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPreviewConfigInterface, PreviewComponent } from '@client-monorepo/daily-fintech/bank-card';
import { NgxSwipeAbleCardComponent } from '@digipay/ngx-swipe-able-card';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'profile-applet-saved-card',
  standalone: true,
  imports: [CommonModule, NgxSwipeAbleCardComponent, PreviewComponent, DpIconComponent],
  templateUrl: './saved-card.component.html',
  styleUrl: './saved-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedCardComponent {
  config = input<CardPreviewConfigInterface>();
  classes = input<string>('');
  cardDelete = output();
  cardPin = output();
  onTap = output();

  onPin(): void {
    //@todo: implement card pin logic
    this.cardPin.emit();
  }

  onDelete(): void {
    //@todo: implement card delete logic
    this.cardDelete.emit();
  }
}
