import { Component, OnInit } from '@angular/core';
import { SupportFaqService } from '../support-faq.service';
import { FaqCategory } from '../../../../../../api/clients/models/support/faq-category';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FaqSearchComponent } from './faq-search/faq-search.component';

@Component({
  selector: 'app-faq-header',
  templateUrl: './faq-header.component.html',
  styleUrls: ['./faq-header.component.scss'],
  standalone: true,
  imports: [FaqSearchComponent, NgIf, NgFor],
})
export class FaqHeaderComponent implements OnInit {
  mostViewedCategories: FaqCategory[] = [];

  constructor(
    private service: SupportFaqService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.service.mostViewedCategories.asObservable().subscribe((mostViewedCategories) => {
      this.mostViewedCategories = mostViewedCategories;
    });
  }

  onCategoryClick(category: FaqCategory) {
    this.service.viewCategory(category);
  }
}
