import { Component, Input, OnInit } from '@angular/core';
import { RenewalStepsListModel } from './models/renewal-steps-list.model';
import { NgClass, NgForOf } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';

@Component({
  selector: 'renewal-steps-list',
  templateUrl: './renewal-steps-list.component.html',
  standalone: true,
  imports: [NgClass, PipesModule, NgForOf],
  styleUrls: ['./renewal-steps-list.component.scss'],
})
export class RenewalStepsListComponent implements OnInit {
  constructor() {}

  @Input()
  listItems: RenewalStepsListModel[];

  @Input()
  hideBorders: boolean;

  isMobile = isMobileOrTablet() || !isDesktop();

  ngOnInit(): void {}
}
