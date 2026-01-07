import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-hot-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hot-sales.component.html',
  styleUrl: './hot-sales.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotSalesComponent {
  @Input() templateData!: any;
}
