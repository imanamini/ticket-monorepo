import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { HINT_TEXT } from './user-card-hint.const';
import { UserCardHintService } from './user-card-hint.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'payment-checkout-user-card-hint',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card-hint.component.html',
  styleUrls: ['./user-card-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardHintComponent {
  public hintText: string = HINT_TEXT;
  @Output() readAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  private userCardHintService = inject(UserCardHintService);
  public done(): void {
    this.userCardHintService.setState();
    this.readAll.emit(true);
  }
}
