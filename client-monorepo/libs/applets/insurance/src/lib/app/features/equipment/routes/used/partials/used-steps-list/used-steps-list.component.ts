import { Component, input } from '@angular/core';
import { UsedStepsListModel } from './models/used-steps-list.model';
import { NgClass, NgStyle } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';

@Component({
  selector: 'used-steps-list',
  templateUrl: './used-steps-list.component.html',
  standalone: true,
  imports: [NgClass, NgStyle, PipesModule],
  styleUrls: ['./used-steps-list.component.scss'],
})
export class UsedStepsListComponent {
  listItems = input<UsedStepsListModel[]>();
  hideBorders = input<boolean>();
  isHighlightMode = input<boolean>();
  hasDivider = input<boolean>(true);
  wrapperStyle = input<{ [key: string]: string }>();
  isMobile = input<boolean>(isMobileOrTablet() || !isDesktop());

  constructor() {}
}
