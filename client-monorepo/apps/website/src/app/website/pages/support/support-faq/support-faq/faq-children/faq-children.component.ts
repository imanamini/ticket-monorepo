import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaqCategory } from '../../../../../../api/clients/models/support/faq-category';
import { SupportFaqService } from '../support-faq.service';
import { Router } from '@angular/router';
import { NgIf, NgStyle, NgOptimizedImage, NgFor } from '@angular/common';

@Component({
  selector: 'app-faq-children',
  templateUrl: './faq-children.component.html',
  styleUrls: ['./faq-children.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, NgOptimizedImage, NgFor],
})
export class FaqChildrenComponent {
  @Input() category: FaqCategory;
  @Output() childrenListEvent = new EventEmitter<boolean>();

  constructor(
    private service: SupportFaqService,
    private router: Router,
  ) {}

  backToParents() {
    this.childrenListEvent.emit(true);
    this.router.navigate([]);
  }

  onChildClick(child: FaqCategory) {
    this.service.viewCategory(child, 'child-start');
  }
}
