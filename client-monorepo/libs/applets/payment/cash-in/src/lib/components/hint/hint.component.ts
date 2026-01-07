import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Hint} from '../../data-access/utils/hint';

@Component({
  selector: 'cash-in-applet-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent {
  @Output() hintWasRead: EventEmitter<boolean> = new EventEmitter<boolean>();

  done() {
    new Hint().setState();
    this.hintWasRead.emit(true);
  }
}
