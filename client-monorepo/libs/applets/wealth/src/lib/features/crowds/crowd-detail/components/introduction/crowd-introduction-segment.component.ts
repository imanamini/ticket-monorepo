import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CrowdIntroductionSegmentPipe } from '../../../pipes/crowd-introduction-segment.pipe';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgClass } from '@angular/common';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CrowdFundingModel } from '../../../data-access/models';

@Component({
  selector: 'app-crowd-introduction-segment',
  templateUrl: './crowd-introduction-segment.component.html',
  styleUrls: ['./crowd-introduction-segment.component.scss'],
  standalone: true,
  imports: [CrowdIntroductionSegmentPipe, PipesModule, NgxButtonComponent, NgClass, NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdIntroductionSegmentComponent {
  crowd = input<CrowdFundingModel>();

  visibleText = signal<boolean>(false);

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
