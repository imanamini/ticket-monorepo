import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { rangeCreator } from '@client-monorepo/common/utilities';

@Component({
  selector: 'inbox-applet-inbox-skeleton-loading',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './inbox-skeleton-loading.component.html',
  styleUrl: './inbox-skeleton-loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxSkeletonLoadingComponent {
  protected readonly rangeCreator = rangeCreator;
}
