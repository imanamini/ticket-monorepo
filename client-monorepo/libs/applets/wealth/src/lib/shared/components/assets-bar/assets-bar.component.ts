import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IBar } from '../../../data-access/models/assets-bar.interface';

@Component({
  selector: 'wealth-applet-assets-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets-bar.component.html',
  styleUrl: './assets-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsBarComponent {
  config = input.required<IBar[]>();
}
