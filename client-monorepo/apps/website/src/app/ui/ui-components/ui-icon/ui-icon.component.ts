import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-ui-icon',
  templateUrl: './ui-icon.component.html',
  styleUrls: ['./ui-icon.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle],
})
export class UiIconComponent {
  @Input()
  icon: string;

  @Input()
  size = 16;
}
