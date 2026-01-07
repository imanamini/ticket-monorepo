import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
/**
 * Simple class for setting the page titles
 * Used for appending a specific string
 * to the titles
 */
export class PageTitleService {
  constructor(
    private title: Title
  ) {
  }

  setTitle(title: string) {
    this.title.setTitle(title + ' | دیجی‌پی');
  }
}
