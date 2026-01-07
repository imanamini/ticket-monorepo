import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'taxi-applet-main-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './taxi-main-skeleton.component.html',
  styleUrl: './taxi-main-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxiMainSkeletonComponent {}
