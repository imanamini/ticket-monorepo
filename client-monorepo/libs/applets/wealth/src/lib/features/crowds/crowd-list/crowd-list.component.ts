import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CrowdListItemComponent } from './components/crowd-list-item/crowd-list-item.component';
import { CROWD_LIST_ROUTE, HOME_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { IFilterItem } from '../../../shared/components/filter/models';
import { FilterModel } from '../../funds/models/filter.model';
import { FilterHandlerService } from '../../../shared/components/filter/services/filter-handler.service';
import { FilterBottomSheetComponent } from '../../../shared/components/filter/components/filter-bottom-sheet/filter-bottom-sheet.component';
import { NotifyMeComponent } from '../../notify-me/notify-me.component';
import { NotifyMeService } from '../../notify-me/services/notify-me.service';
import { of, switchMap } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { BackToOriginService } from '../../../shared/services/back-to-origin.service';
import { CrowdFundingModel, ICrowdState } from '../data-access/models';
import { ECrowdFilter } from './models/crowd-filter.model';
import { CrowdFundingService } from '../data-access/services/crowd-funding.service';

@Component({
  selector: 'app-crowd-list',
  templateUrl: './crowd-list.component.html',
  styleUrls: ['./crowd-list.component.scss'],
  standalone: true,
  imports: [NgxAppBarComponent, CrowdListItemComponent, NotifyMeComponent, FilterComponent, NgxButtonComponent, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdListComponent implements OnInit {
  private router = inject(Router);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private notifyMeService = inject(NotifyMeService);
  private backToOrigin = inject(BackToOriginService);
  private bottomSheet = inject(NgxBottomSheetService);
  private crowdFundingService = inject(CrowdFundingService);
  private filterHandlerService = inject(FilterHandlerService);
  private navigationService = inject(WealthNavigationService);

  loading = signal<boolean>(true);
  filters = signal<IFilterItem[]>([]);
  notifyOption = signal<boolean>(true);
  crowdList = signal<CrowdFundingModel[]>([]);
  hasNotify = signal<number | undefined>(undefined);
  state = signal<ICrowdState | undefined>(undefined);
  notifyLoading = signal<boolean | undefined>(undefined);
  selectedFilters = signal<Record<string, string[]> | undefined>(undefined);

  crowdsFilter: FilterModel<ECrowdFilter>;

  private setActiveFilters(filters: IFilterItem[]): IFilterItem[] {
    filters.forEach((filter) => {
      this.crowdsFilter?.status.includes(filter.value) || filter.active ? (filter.active = true) : (filter.active = false);
    });
    return filters;
  }

  ngOnInit() {
    this.initFilters();
    this.getData();
  }

  private initFilters() {
    this.filters.set(this.setActiveFilters(this.filterHandlerService.getFilterItems(this.router.url)));
    this.state.set(this.routeState.getAll());
    if (this.state()?.filters) {
      this.updateFilter(this.state()?.filters);
    } else {
      this.filters().find((filter) => filter.value === 'Active').active = true;
    }
  }

  private getData() {
    this.notifyMeService
      .hasInform('crowd-fund-2')
      .pipe(
        switchMap((res) => {
          if (res.result) {
            this.hasNotify.set(res.result);
            this.notifyOption.set(!res.result);
          }
          if (this.state()?.filters) {
            return of(null);
          }
          return this.crowdFundingService.getCrowdFundingList(this.crowdsFilter);
        }),
      )
      .subscribe((res) => {
        if (res?.success && res.result) {
          this.crowdList.set(res.result.details);
          const activeProjects = this.crowdList()?.filter((crowd) => crowd.status.toLocaleLowerCase() === 'active');
          this.notifyOption.set(activeProjects.length === 0 && !this.hasNotify());
        }

        this.loading.set(false);
      });
  }

  onBackHandler() {
    const qParams = this.activatedRoute.snapshot.queryParams;
    if (qParams['referrer'] === 'dpxapp') {
      this.backToOrigin.goBackToOrigin();
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  notifyMe() {
    this.notifyMeService.inform('crowd-fund-2').subscribe((res) => {
      if (res?.success) {
        this.notifyOption.set(false);
        this.messageService.showSuccessMessage('خبرتان میکنیم');
      } else {
        this.messageService.showErrorMessage('درخواست شما ارسال نشد.');
      }
      this.notifyLoading.set(false);
    });
  }

  selectFilter(filterItem: IFilterItem) {
    if (filterItem.static === true) {
      this.bottomSheet.openBottomSheet(FilterBottomSheetComponent, {
        filters: JSON.parse(JSON.stringify(this.filters)),
        title: 'وضعیت طرح را انتخاب کنید',
      });

      const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
        bottomSheetService.unsubscribe();
        const result = this.bottomSheet.outputData();
        if (result) {
          this.updateFilter(this.generateFilter(result));
          this.filters().forEach((filter) => {
            filter.active = result.find((u) => u.value === filter.value)?.active;
          });
        }
      });
    } else {
      this.updateFilter(
        this.generateFilter(this.filters().filter((filter) => (filter.value === filterItem.value && filterItem.active) || filter.active)),
      );
    }
  }

  private generateFilter(filters: IFilterItem[]): { status: string[] } {
    return { status: filters.map((item) => item.value) };
  }

  updateFilter(filters: Record<string, string[]>) {
    this.loading.set(true);
    this.selectedFilters.set(filters);
    this.crowdFundingService.getCrowdFundingList(filters).subscribe((res) => {
      if (res?.success && res.result) {
        this.crowdList.set(res.result.details);
        for (const [keys, values] of Object.entries(filters)) {
          this.filters().forEach((filter) => {
            values.includes(filter.value) ? (filter.active = true) : (filter.active = false);
          });
        }
      }
      this.loading.set(false);
    });
  }

  crowdDetail(crowd: CrowdFundingModel) {
    this.navigationService.navigate([CROWD_LIST_ROUTE, crowd.symbol], {
      state: {
        filters: this.selectedFilters(),
      },
    });
  }
}
