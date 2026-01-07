import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'bill-applet-main-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './bill-main-skeleton.component.html',
  styleUrl: './bill-main-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillMainSkeletonComponent {}
