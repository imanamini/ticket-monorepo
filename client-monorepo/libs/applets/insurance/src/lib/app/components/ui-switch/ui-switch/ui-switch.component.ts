import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { SwitchOption } from '../models/switch-option.model';
import { NgClass, NgForOf, NgStyle } from '@angular/common';
import { SwitchService } from '../service/switch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ui-switch-control',
  templateUrl: './ui-switch.component.html',
  styleUrls: ['./ui-switch.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgStyle
  ]
})
export class UiSwitchComponent implements OnInit, OnDestroy {

  @Input()
  options: SwitchOption[];

  @Input()
  disabled = false;

  @Output()
  change: EventEmitter<any> = new EventEmitter();

  // Subscription
  subscriptions: Subscription[] = [];

  selectedOption: SwitchOption;

  constructor(private switchService: SwitchService) {
  }

  ngOnInit(): void {
    this.subscribeToTabSwitch();
  }

  subscribeToTabSwitch(): void {
    // default selected Tab
    const subscription = this.switchService.getSelectedTab()
      .subscribe({
        next: (res: SwitchOption): void => {
          if (res) {
            this.selectedOption = res;
          } else {
            this.selectedOption = this.options[0];
          }
          this.change.emit(this.selectedOption);
        }
      });
    this.subscriptions.push(subscription);
  }

  optionClick(index: number): void {
    if (!this.disabled) {
      this.selectedOption = this.options[index];
      this.switchService.setSelectedTab(this.options[index]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }
}
