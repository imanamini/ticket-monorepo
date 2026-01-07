import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { MyCardsComponent } from '../../../../components/my-cards/my-cards.component';
import { DestinationCardsComponent } from '../../../../components/destination-cards/destination-cards.component';
import { ActivatedRoute } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'profile-applet-saved-cards',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, TabGroupComponent],
  templateUrl: './saved-cards.component.html',
  styleUrl: './saved-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedCardsComponent implements OnInit, OnDestroy {
  tabs!: Array<TabConfig>;
  activatedRoute = inject(ActivatedRoute);
  bottomNavigationService = inject(NgxBottomNavigationService);

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.initializeTabConfig();
  }

  initializeTabConfig(): void {
    const activeTab = this.activatedRoute.snapshot.queryParams['tab'] === 'destination' ? 'DESTINATION' : 'MINE';
    this.tabs = [
      {
        label: signal('کارت‌های من'),
        isActive: signal(activeTab === 'MINE'),
        component: signal(MyCardsComponent),
      },
      {
        label: signal('کارت‌های مقصد'),
        isActive: signal(activeTab === 'DESTINATION'),
        component: signal(DestinationCardsComponent),
      },
    ];
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
