import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { FAQ_CATEGORY_TYPE_ENUM_TRANSLATOR, FaqCategoryTypeEnum } from '../../data-access/enums/faq-category-type.enum';
import { FaqCategoryModel } from './data-access/model/faq-category.model';
import { NgClass } from '@angular/common';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { AccordionComponent } from '../../components/accordion/accordion.component';
import { AccordionModel } from '../../data-access/models/accordion.model';
import { FAQ_ITEMS } from './data-access/constants/faq-items.constant';
import { ActivatedRoute } from '@angular/router';
import { InsuranceHeaderComponent } from '../../components/insurance-header/insurance-header.component';

@Component({
  selector: 'faq',
  standalone: true,
  imports: [
    MainHeaderComponent,
    NgClass,
    NgxSearchBoxComponent,
    AccordionComponent,
    InsuranceHeaderComponent
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {

  categories = signal<FaqCategoryModel[]>([]);
  selectedCategory = signal<FaqCategoryTypeEnum>(FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);
  items = signal<Array<AccordionModel>>([]);
  filteredItems = signal<Array<AccordionModel>>([]);
  searchText = model<string>(null);

  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.setCategories();
    this.preselectCategory();
    this.initializeFaqItems();
  }

  preselectCategory(): void {
    this.selectedCategory.set(this.activatedRoute.snapshot.queryParams.category ?? FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);
  }

  setCategories(): void {
    const categoryKeys: FaqCategoryModel[] = Object.values(FaqCategoryTypeEnum)
      .filter(v => typeof v !== 'string')
      .map((c: FaqCategoryTypeEnum) => ({
        title: FAQ_CATEGORY_TYPE_ENUM_TRANSLATOR[c],
        type: c
      }));
    this.categories.set(categoryKeys);
  }

  selectCategory(categoryType: FaqCategoryTypeEnum): void {
    this.searchText.set(undefined);
    this.selectedCategory.set(categoryType);
    this.initializeFaqItems();
  }

  initializeFaqItems(): void {
    this.items.set(FAQ_ITEMS[this.selectedCategory()]);
    this.filteredItems.set(this.items());
  }

  searchChangeEnd(text: string): void {
    if (text.length === 0) {
      this.filteredItems.set(this.items());
    }
    const filtered = this.items().filter(item => {
      return `${item.title} ${item.description}`.includes(text);
    });
    this.filteredItems.set(filtered);
  }

  backButtonClick(): void {
    window.history.back();
  }
}
