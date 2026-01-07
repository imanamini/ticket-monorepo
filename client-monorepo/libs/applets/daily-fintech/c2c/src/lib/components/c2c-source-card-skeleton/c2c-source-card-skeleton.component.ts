import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'c2c-applet-source-card-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent],
  templateUrl: './c2c-source-card-skeleton.component.html',
  styleUrl: './c2c-source-card-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cSourceCardSkeletonComponent {}
