import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pay-club-applet-receive-coin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receive-coin.component.html',
  styleUrls: ['./receive-coin.component.scss'],
})
export class ReceiveCoinComponent {
  @Input() isLoggedIn!: boolean;
  @Input() balance!: number;

  @Output() getScoreClicked = new EventEmitter();

  getCoin(): void {
    this.getScoreClicked.emit();
  }
}
