import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { rangeCreator } from '@client-monorepo/common/utilities';

@Component({
  selector: 'internet-applet-main-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent],
  templateUrl: './internet-main-skeleton.component.html',
  styleUrl: './internet-main-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternetMainSkeletonComponent {
  protected readonly rangeCreator = rangeCreator;
}
