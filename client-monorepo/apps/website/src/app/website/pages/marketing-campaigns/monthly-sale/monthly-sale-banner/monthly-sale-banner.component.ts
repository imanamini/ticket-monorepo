import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-sale-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-sale-banner.component.html',
  styleUrl: './monthly-sale-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlySaleBannerComponent {
  @Input() templateData!: any;
}


