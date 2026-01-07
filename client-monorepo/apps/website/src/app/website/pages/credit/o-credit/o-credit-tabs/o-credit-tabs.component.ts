import { Component, Input } from '@angular/core';
import { OCreditSteps } from '../../../../../api/clients/models/templates/o-credit/o-credit-template-data';
import { UiHorizontalFlowComponent } from '../../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-o-credit-tabs',
  templateUrl: './o-credit-tabs.component.html',
  styleUrls: ['./o-credit-tabs.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiHorizontalFlowComponent],
})
export class OCreditTabsComponent {
  @Input()
  data!: OCreditSteps;

  show = true;

  selectedTab = 0;

  changeTab(tab: number) {
    this.selectedTab = tab;
    this.show = false;
    of('')
      .pipe(delay(1))
      .subscribe({
        next: (value) => {
          this.show = true;
        },
      });
  }
}
