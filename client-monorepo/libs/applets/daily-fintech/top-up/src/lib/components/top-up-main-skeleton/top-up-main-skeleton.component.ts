import { ChangeDetectionStrategy, Component } from '@angular/core';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'top-up-applet-main-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent],
  templateUrl: './top-up-main-skeleton.component.html',
  styleUrl: './top-up-main-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopUpMainSkeletonComponent {
  protected readonly rangeCreator = rangeCreator;
}
