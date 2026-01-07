import { Component, Directive, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { INSURANCE_PAGE_TILES_TRANSLATOR, InsurancePageTitleEnum } from '../../data-access/enums/insurance-page-title.enum';
import { Location } from '@angular/common';
import { HeaderService } from '../../data-access/services/header.service';

@Directive()
export class BaseComponent implements OnDestroy {

  private subscriptions: Subscription = new Subscription();

  titleService = inject(Title);
  protected headerService = inject(HeaderService);
  activatedRoute = inject(ActivatedRoute);
  protected location = inject(Location);

  constructor() {
    this.setPageTitle();
  }

  setPageTitle(): void {
    const title = this.activatedRoute.snapshot.data?.title;
    if (title) {
      this.titleService.setTitle(`${InsurancePageTitleEnum.Default} | ${INSURANCE_PAGE_TILES_TRANSLATOR[title]}`);
    }
  }

  addSubscription(s: Subscription): void {
    this.subscriptions.add(s);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
