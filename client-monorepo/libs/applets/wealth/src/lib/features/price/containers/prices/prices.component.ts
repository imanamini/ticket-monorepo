import { ChangeDetectorRef, Component, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { TabComponent } from '../../../../shared/components/tab/tab.component';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss'],
  imports: [NgxAppBarComponent, TabComponent, TabsComponent],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class PricesComponent implements OnInit {
  myScriptElement!: HTMLScriptElement;

  private cdr = inject(ChangeDetectorRef);
  private navigationService = inject(WealthNavigationService);
  private eventService = inject(NgxEventTrackerService);

  ngOnInit(): void {
    this.eventService.sendEvent({ eventName: EIntrackEventName.PRICE_PAGE_VIEW, eventData: {} });
    this.paintGrid();
  }

  paintGrid() {
    this.myScriptElement = document.createElement('script');
    this.myScriptElement.className = 'tgju-api';
    this.myScriptElement.src = 'https://api.tgju.org/v1/widget/v2';
    const tgjuScript = document.body.querySelector('.tgju-api');
    if (tgjuScript) {
      document.body.removeChild(tgjuScript);
    }
    document.body.appendChild(this.myScriptElement);
  }

  onTabChanged() {
    this.paintGrid();
    this.cdr.detectChanges();
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
