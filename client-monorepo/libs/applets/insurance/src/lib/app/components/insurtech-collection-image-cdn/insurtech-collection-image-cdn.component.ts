import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { CoverageIdentifiers } from '../../features/equipment/api/models/coverage/coverage-multiselection.model';

@Component({
  selector: 'insurtech-collection-image-cdn',
  templateUrl: './insurtech-collection-image-cdn.component.html',
  styleUrls: ['./insurtech-collection-image-cdn.component.scss'],
  standalone: true
})
export class InsurtechCollectionImageCdnComponent implements OnInit, OnChanges {

  @Input()
  category: 'category' | 'coverage' | string;

  @Input()
  subCategory: CoverageIdentifiers | string;

  @Input()
  status: 'active' | 'canceled' | 'expired' | 'paid' | 'pending' | 'terminated' | 'inactive' | string;

  Link = '';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.Link = `https://insurance-api.mydigipay.com/api/cdn/${
      this.category.toLocaleLowerCase()}/${this.subCategory.toLocaleLowerCase()}/${this.status.toLocaleLowerCase()}.svg`;
  }

  ngOnInit(): void {
  }

}
