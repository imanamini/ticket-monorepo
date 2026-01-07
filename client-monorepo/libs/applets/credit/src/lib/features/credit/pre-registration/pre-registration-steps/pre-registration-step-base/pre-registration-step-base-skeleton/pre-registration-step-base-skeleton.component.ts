import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'app-pre-registration-step-base-skeleton',
  templateUrl: './pre-registration-step-base-skeleton.component.html',
  imports: [NgxDividerComponent, NgxSkeletonLoadingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepBaseSkeletonComponent {
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
