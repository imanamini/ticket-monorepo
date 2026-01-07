import { Component, inject, model, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FaqCategoryModel } from '../../data-access/model/faq-category.model';
import { FAQ_CATEGORY_TYPE_ENUM_TRANSLATOR, FaqCategoryTypeEnum } from '../../data-access/model/faq-category-type.enum';
import { FAQ_ITEMS } from '../../data-access/constants/faq-items.constant';
import { AccordionConfig, NgxAccordionComponent } from '@digipay/ngx-accordion';

@Component({
  selector: 'direct-debit-faq',
  standalone: true,
  imports: [NgClass, NgxSearchBoxComponent, PageLayoutComponent, NgxAccordionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  categories = signal<FaqCategoryModel[]>([]);
  selectedCategory = signal<FaqCategoryTypeEnum>(FaqCategoryTypeEnum.DIRECT_DEBIT);
  items = signal<Array<any>>([]);
  filteredItems = signal<AccordionConfig<any>[]>(FAQ_ITEMS[FaqCategoryTypeEnum.DIRECT_DEBIT] as any);
  searchText = model<string>('');

  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.setCategories();
    this.preselectCategory();
    this.initializeFaqItems();
  }

  preselectCategory(): void {
    this.selectedCategory.set(this.activatedRoute.snapshot.queryParams?.category ?? FaqCategoryTypeEnum.DIRECT_DEBIT);
  }

  setCategories(): void {
    const categoryKeys: FaqCategoryModel[] = Object.values(FaqCategoryTypeEnum)
      .filter((v) => typeof v !== 'string') 
      .map((c: FaqCategoryTypeEnum) => ({
        title: FAQ_CATEGORY_TYPE_ENUM_TRANSLATOR[c],
        type: c,
      }));
    this.categories.set(categoryKeys);
  }

  selectCategory(categoryType: FaqCategoryTypeEnum): void {
    this.searchText.set('');
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
    const filtered = this.items().filter((item) => {
      return `${item.accordionTitle} ${item.inputs.data}`.includes(text);
    });
    this.filteredItems.set(filtered);
  }

  onBack() {
    history.back();
  }
}
