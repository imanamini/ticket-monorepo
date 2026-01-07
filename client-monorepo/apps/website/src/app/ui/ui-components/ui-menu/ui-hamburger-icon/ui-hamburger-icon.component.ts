import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-hamburger-icon',
  templateUrl: './ui-hamburger-icon.component.html',
  styleUrls: ['./ui-hamburger-icon.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class UiHamburgerIconComponent {
  @Output()
  clicked = new EventEmitter();

  @Input()
  isActive = false;
  onIconClick() {
    this.isActive = !this.isActive;
    this.clicked.emit();
  }
}
