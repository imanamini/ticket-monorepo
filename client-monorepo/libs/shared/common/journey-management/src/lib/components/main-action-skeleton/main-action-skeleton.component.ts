import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'common-journey-management-main-action-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './main-action-skeleton.component.html',
  styleUrl: './main-action-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainActionSkeletonComponent {}
