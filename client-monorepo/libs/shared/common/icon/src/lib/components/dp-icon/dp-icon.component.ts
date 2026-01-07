import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'common-icon-dp-icon',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './dp-icon.component.html',
  styleUrl: './dp-icon.component.scss',
})
export class DpIconComponent {
  icon = input.required<string>();
  gradientMode = input<'tint' | 'none'>('none');
  classes = input<string>('');
  styles = input<string>('');
  iconType = input<'bold' | 'linear' | 'due'>('bold');
  secondaryColor = input<string>();
  iconSize = input<string>('32');
}
