import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'c2c-applet-transaction-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-action.component.html',
  styleUrls: ['./transaction-action.component.scss'],
})
export class TransactionActionComponent {
  @Input()
  title = '';

  @Input()
  active!: boolean;

  @Output()
  action = new EventEmitter<string>();

  @Input()
  type!: 'save' | 'repeat';

  onAction() {
    this.action.emit(this.type);
  }
}
