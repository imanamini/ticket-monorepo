import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiSwitchComponent } from '../ui-switch/ui-switch.component';

@Component({
  selector: 'app-ui-switch-box',
  templateUrl: './ui-switch-box.component.html',
  styleUrls: ['./ui-switch-box.component.scss'],
  standalone: true,
  imports: [UiSwitchComponent],
})
export class UiSwitchBoxComponent {
  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  checked = false;

  @Output()
  switchChanged = new EventEmitter<boolean>();

  onSwitchChange($event): void {
    this.switchChanged.emit($event);
  }
}
