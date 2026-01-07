import { NgxButtonComponent } from '@digipay/ngx-button';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CrowdInfoPipe } from '../../../pipes/crowd-info.pipe';
import { ProjectStatusDetailComponent } from '../../../components/project-status-detail/project-status-detail.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CrowdFundingModel } from '../../../data-access/models';

@Component({
  selector: 'app-crowd-list-item',
  templateUrl: './crowd-list-item.component.html',
  styleUrls: ['./crowd-list-item.component.scss'],
  standalone: true,
  imports: [CrowdInfoPipe, NgxButtonComponent, ProjectStatusDetailComponent, NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdListItemComponent {
  goDetail = output<void>();
  crowd = input.required<CrowdFundingModel>();

  protected readonly BorderColorsEnum = BorderColorsEnum;

  readonly actionLabel = computed(() => {
    const crowd = this.crowd();
    return crowd.successPercentage === 100 || !crowd.buyable ? 'جزییات' : 'جزییات و سرمایه گذاری';
  });

  goToDetail() {
    this.goDetail.emit();
  }
}
