import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TabConfig } from '../../data-access/models/tabs-config';

@Component({
  selector: 'common-ui-components-tab-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent {
  tabs = input.required<TabConfig[]>();
  mode = input<'section' | 'page'>('section');
  location = inject(Location);

  activateTab(index: number): void {
    const pervActiveTab = this.findActiveTab();
    if (pervActiveTab.label() === this.tabs()[index].label()) {
      return;
    }
    this.tabs()[index].isActive.set(true);
    if (this.tabs()[index].relatedChildLink) {
      this.location.go(this.tabs()[index].relatedChildLink as string);
    }
    pervActiveTab.isActive.set(false);
  }

  findActiveTab(): TabConfig {
    return this.tabs().find((t) => t.isActive()) as TabConfig;
  }
}
