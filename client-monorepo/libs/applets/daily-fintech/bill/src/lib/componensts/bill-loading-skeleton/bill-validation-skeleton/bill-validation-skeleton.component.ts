import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'bill-applet-validation-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './bill-validation-skeleton.component.html',
  styleUrl: './bill-validation-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillValidationSkeletonComponent {}
