import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'subscription-applet-plans-list-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './plans-list-skeleton.component.html',
  styleUrl: './plans-list-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansListSkeletonComponent {}
