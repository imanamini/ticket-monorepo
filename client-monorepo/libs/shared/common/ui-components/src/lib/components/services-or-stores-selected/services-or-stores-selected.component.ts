import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ItemOverview, SelectedSectionHeader } from '@client-monorepo/common/ui-components';
import { ListCategoriesHeaderComponent } from '../list-categories-header/list-categories-header.component';
import { ItemOverviewComponent } from '../item-overview/item-overview.component';

@Component({
  selector: 'common-ui-components-services-or-stores-selected',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxBadgeModule, ListCategoriesHeaderComponent, ItemOverviewComponent],
  templateUrl: './services-or-stores-selected.component.html',
  styleUrl: './services-or-stores-selected.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesOrStoresSelectedComponent {
  services = input.required<ItemOverview[]>();
  header = input<SelectedSectionHeader>();
}
