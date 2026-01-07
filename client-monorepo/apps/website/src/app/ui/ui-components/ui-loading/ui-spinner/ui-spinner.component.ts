import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-spinner',
  templateUrl: './ui-spinner.component.html',
  styleUrls: ['./ui-spinner.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class UiSpinnerComponent {
  @Input()
  title!: string;

  @Input()
  subtitle!: string;

  @Input()
  size = 24;

  @Input()
  opacity = 0.3;
}
