import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { IranianRialsPipe } from '../../../../../../../../../apps/website/src/app/ui/ui-pipes/iranian-rials.pipe';
import { CrowdFundingModel } from '../../data-access/models';

@Component({
  selector: 'app-project-status-detail',
  templateUrl: './project-status-detail.component.html',
  styleUrls: ['./project-status-detail.component.scss'],
  standalone: true,
  imports: [NgxBadgeModule, StatusBarComponent, IranianRialsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusDetailComponent {
  crowd = input<CrowdFundingModel>();
}
