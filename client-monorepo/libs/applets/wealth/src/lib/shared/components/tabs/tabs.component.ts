import { AfterContentInit, Component, ContentChildren, input, output, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { Tab } from '../../../data-access/models/tab.model';
import { CommonModule } from '@angular/common';
import { NgxTabComponent, NgxTabsComponent } from '@digipay/ngx-tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxTabsComponent, NgxTabComponent],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  defaultActiveTabIndex = input<number>(0);
  onTabChange = output<Tab>();
  onTabsInitialize = output<Tab[]>();

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter((tab) => tab.active);
    if (activeTabs.length === 0) {
      this.selectInitialTab(this.defaultActiveTabIndex());
    }
  }

  tabChanged(tab: Tab) {
    this.onTabChange.emit(tab);
  }

  tabInitialize(tabs: Tab[]) {
    this.onTabsInitialize.emit(tabs);
  }

  selectInitialTab(tabIndex: number) {
    const tabsArray = this.tabs.toArray();
    tabsArray.forEach((tab, index) => {
      tab.active = false;
      tab.id = index + 1;
    });
    tabsArray[tabIndex].active = true;
    this.tabInitialize(tabsArray);
  }

  selectTab(tab: Tab) {
    if (tab.isDisabled) return;
    const activeTab = this.tabs.find((tab) => tab.active);
    if (activeTab === tab) return;
    if (activeTab) activeTab.active = false;
    tab.active = true;
    this.tabChanged(tab);
  }
}
