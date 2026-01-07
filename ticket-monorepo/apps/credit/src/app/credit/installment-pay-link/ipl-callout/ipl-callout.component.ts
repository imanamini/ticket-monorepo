import { Component, input } from '@angular/core';

@Component({
  selector: 'ipl-callout',
  templateUrl: './ipl-callout.component.html',
  styleUrl: '../ipl.style.scss',
  standalone: true,
})
export class IplCalloutComponent {
  title = input<string>();
  linkTitle = input<string>();
}
