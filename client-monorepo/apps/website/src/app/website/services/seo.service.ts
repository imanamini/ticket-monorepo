import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Page } from '../../api/clients/models/content/page';
import { BlogPost } from '../../api/clients/models/content/blog-post';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  setGlobalMetaTagsFromPage(page: Page<any> | BlogPost) {
    this.setPageTitle(page.seoTitle || page.title);
    let pathPrefix = '';
    let pageSlug = page.slug;
    if (page.pathPrefix !== 'p') {
      pathPrefix = '/' + page.pathPrefix + '/';
      if (page.slug === 'home') {
        pathPrefix = '';
        pageSlug = '';
      }
    } else {
      pathPrefix = '/';
    }

    if (page.pathPrefix === undefined && (page as BlogPost).category) {
      pathPrefix = '/mag/' + (page as BlogPost).category.slug + '/';
    }

    const canonicalUrl = page.canonical || 'https://www.mydigipay.com' + pathPrefix + pageSlug + '/';
    this.setCanonical(canonicalUrl);

    this.setMetaTags([
      { name: 'description', content: page.seoDescription },
      { name: 'keywords', content: page.seoKeywords },
      { property: 'og:title', content: page.seoTitle || page.title },
      { property: 'og:description', content: page.seoDescription },
      { property: 'og:image', content: page?.image?.url ?? '' },
    ]);

    const robotsContent = page.seoNoIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    this.setMetaTag({ name: 'robots', content: robotsContent });
  }

  setPageTitle(title: string) {
    this.title.setTitle(title || 'دیجی‌پی');
  }

  /**
   * Updates or adds a single meta tag safely (no duplicates)
   */
  setMetaTag(tag: MetaDefinition) {
    const selector = tag.name ? `name='${tag.name}'` : tag.property ? `property='${tag.property}'` : '';
    if (selector) {
      this.meta.updateTag(tag, selector);
    } else {
      this.meta.addTag(tag);
    }
  }

  /**
   * Updates or adds multiple tags safely
   */
  setMetaTags(tags: MetaDefinition[]) {
    tags.forEach(tag => this.setMetaTag(tag));
  }

  /**
   * Ensures only one canonical link exists
   */
  setCanonical(url: string) {
    if (!url) return;
    let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']");
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.doc.head.appendChild(link);
    }
  }
}
