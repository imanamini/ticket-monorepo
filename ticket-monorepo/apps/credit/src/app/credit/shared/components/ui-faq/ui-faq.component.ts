import { Component, computed, EventEmitter, input, OnInit, Output, signal } from '@angular/core';

export interface FaqItem {
  question: string;
  answer: string;
  itemId?: string;
  link?: { title: string, url: string };
}

@Component({
  selector: 'ui-faq',
  templateUrl: './ui-faq.component.html',
  styleUrls: ['./ui-faq.component.scss']
})
export class UiFaqComponent implements OnInit {

  faqs = input<FaqItem[]>(null);

  title = input('');

  subtitle = input('');

  openItemIndex = signal(null);
  @Output() itemOpened = new EventEmitter<FaqItem>();
  showAll = signal(false);
  visibleFaqs = computed(() => {
    return this.showAll() ? this.faqs() : this.faqs().slice(0, 4);
  });

  showAllButtonText = computed(() => {
    return this.showAll() ? 'نمایش کمتر' : 'مشاهده همه سوالات';
  });

  constructor() {
  }

  ngOnInit(): void {

  }

  openItemFaq(index: number | null) {
    if (this.openItemIndex() === index) {
      this.openItemIndex.set(-1);
    } else {
      this.openItemIndex.set(index);
      this.itemOpened.emit(this.faqs[index]);
    }
  }

  toggleShowAll() {
    this.showAll.update(value => !value);
    this.openItemIndex.set(null); // Close any open item when toggling
  }

}
