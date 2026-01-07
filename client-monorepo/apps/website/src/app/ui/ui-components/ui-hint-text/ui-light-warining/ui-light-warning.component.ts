import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-ui-light-warning',
  templateUrl: './ui-light-warning.component.html',
  styleUrls: ['./ui-light-warning.component.scss'],
  standalone: true,
  imports: [NgStyle],
})
export class UiLightWarningComponent {
  @Input()
  iconSize = 16;

  @Input()
  fontSize = 16;
}
