import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'common-journey-management-other-actions-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './other-actions-skeleton.component.html',
  styleUrl: './other-actions-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherActionsSkeletonComponent {}
