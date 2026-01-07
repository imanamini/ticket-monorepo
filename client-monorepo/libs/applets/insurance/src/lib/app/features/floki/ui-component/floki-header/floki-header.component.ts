import { Component, input, output } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'floki-header',
  standalone: true,
  imports: [
    NgxIcon,
    NgClass
  ],
  templateUrl: './floki-header.component.html',
  styleUrl: './floki-header.component.scss'
})
export class FlokiHeaderComponent {
  hasIcon = input<boolean>();
  iconName = input<string>();
  iconColor = input<string>();
  iconTitle = input<string>();
  iconType = input<string>();
  class = input<string>();
  title = input<string>();
  titleTextAlign = input<'center' | 'right' | 'left'>();
  iconClickHandler = output();

  handleClick(): void {
    this.iconClickHandler.emit();
  }
}
