import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CategorizedListModel, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { categorizeServiceItemsByTags } from '../../../data-access/utils/categorize-plan-services';
import { PlanServiceListComponent } from '../plan-services-list/plan-service-list.component';
@Component({
  selector: 'digipay-card-applet-plan-services',
  templateUrl: './plan-services.component.html',
  standalone: true,
  imports: [PlanServiceListComponent],
  styleUrls: ['./plan-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanServicesComponent {
  plan = input.required<SubscriptionPlan>();
  categorizeList = computed<CategorizedListModel[]>((): CategorizedListModel[] => categorizeServiceItemsByTags(this.plan()));
  isLoaded = computed(() => this.categorizeList().length > 0);
}
