import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardsComponent } from './blog-cards/blog-cards.component';

@NgModule({
  exports: [BlogCardsComponent],
  imports: [CommonModule, BlogCardsComponent],
})
export class UiBlogPostSectionModule {}
