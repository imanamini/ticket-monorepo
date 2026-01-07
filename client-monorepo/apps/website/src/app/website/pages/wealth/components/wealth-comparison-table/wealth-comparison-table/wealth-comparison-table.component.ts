import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { WealthComparisonTable } from '../../../../../../api/clients/models/templates/wealth/wealth-template-data';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-wealth-comparison-table',
  templateUrl: './wealth-comparison-table.component.html',
  styleUrls: ['./wealth-comparison-table.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, UiIconDirective, NgIf, UiButtonComponent],
})
export class WealthComparisonTableComponent implements AfterViewInit {
  @Input()
  data: WealthComparisonTable;

  trs: HTMLCollectionOf<any>;
  startWith = 5;
  isTableExpanded = false;
  markets = ['realState', 'bourse', 'automobile', 'bank', 'gold'];
  marketProperties = [
    [
      {
        title: 'امنیت',
        availableMarkets: ['bourse', 'bank'],
      },
    ],
    [
      {
        title: 'نقدشوندگی',
        availableMarkets: ['bourse', 'automobile', 'bank', 'gold'],
      },
    ],
    [
      {
        title: 'استهلاک',
        availableMarkets: ['bourse', 'bank', 'gold'],
      },
    ],
    [
      {
        title: 'سرمایه‌گذاری با مبلغ کم',
        availableMarkets: ['bourse', 'bank', 'gold'],
      },
    ],
  ];

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  showMore() {
    if (isPlatformBrowser(this.platformId)) {
      for (let i = this.startWith; i < this.trs.length; i++) {
        this.trs[i].classList.toggle('hidden');
      }
      this.isTableExpanded = !this.isTableExpanded;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.trs = document.getElementsByTagName('tr');
    }
  }
}
