import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FavouritePackagesResponse } from '../../../../api/digipay/models/internet/favourite';
import { InternetPackage } from '../../../../api/digipay/models/internet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiInternetPackageComponent } from '../ui-internet-package/ui-internet-package.component';
import { UiCarrierIconComponent } from '../../../ui-components/ui-cell-number-field/ui-carrier-icon/ui-carrier-icon.component';
import { UiSectionComponent } from '../../../ui-components/ui-section/ui-section/ui-section.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-internet-packages-box',
  templateUrl: './ui-internet-packages-box.component.html',
  styleUrls: ['./ui-internet-packages-box.component.scss'],
  standalone: true,
  imports: [NgIf, UiSectionComponent, UiCarrierIconComponent, NgFor, UiInternetPackageComponent, PipesModule],
})
export class UiInternetPackagesBoxComponent implements OnChanges {
  @Input()
  group: FavouritePackagesResponse;

  @Output()
  packageClick = new EventEmitter<InternetPackage>();

  packagesCount = 0;

  showAll = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.countPackages();
    }
  }

  onPackageClick(item): void {
    this.packageClick.emit(item);
  }

  /**
   * Since packages are not part of a single array,
   * we need to count them once and store the index
   * of each item to provide the "showAll" mechanism
   */
  private countPackages(): void {
    let count = 0;
    let index = 0;
    this.group.bundles.forEach((b, bi) => {
      count += b.internetPackages.length;
      this.group.bundles[bi].internetPackages = b.internetPackages.map((item) => {
        item.index = index;
        index += 1;
        return item;
      });
    });
    this.packagesCount = count;
  }
}
