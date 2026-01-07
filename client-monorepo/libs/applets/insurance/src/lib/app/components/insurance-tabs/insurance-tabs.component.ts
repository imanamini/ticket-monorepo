import { Component, input, model } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { InsuranceTabModel } from '../../data-access/models/insurance-tab.model';
import { NgxTabComponent, NgxTabsComponent } from '@digipay/ngx-tabs';
import { InsuranceTabEnum } from '../../features/policy/data-access/enums/policy-list.enum';

@Component({
  selector: 'insurance-tabs',
  standalone: true,
  imports: [NgxTabsComponent, NgxTabComponent],
  templateUrl: './insurance-tabs.component.html',
  styleUrl: './insurance-tabs.component.scss',
})
export class InsuranceTabsComponent extends BaseComponent {
  constructor() {
    super();
  }

  tabs = input.required<ReadonlyArray<InsuranceTabModel>>();
  activeTab = model.required<InsuranceTabEnum | string | number>();

  handleStateChange(e: unknown, value: InsuranceTabEnum | string | number): void {
    if (e === 'selected') {
      this.activeTab.set(value);
    }
  }
}
