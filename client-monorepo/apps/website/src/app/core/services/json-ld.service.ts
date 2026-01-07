import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonLDService {
  static scriptType = 'application/ld+json';
  websiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    url: 'https://omranmodern.com',
    name: 'تجارت گستران نواندیش اورامان',
    sameAs: ['https://facebook.com/omranmodern', 'https://instagram.com/omranmodern', 'https://twitter.com/omranmodern'],
  };

  orgSchema = {
    corporation: {
      '@context': 'https://schema.org',
      '@type': 'Corporation',
      id: 'https://www.omranmodern.com/#corporation',
      name: 'عمران مدرن',
      alternateName: ['عمران‌مدرن', 'Omranmodern'],
      legalName: 'تجارت گستران نواندیش اورامان',
      url: 'https://www.omranmodern.com',
      logo: 'https://omranmodern.com/mag/wp-content/uploads/2021/09/Artboard-1%40150x-100.png',
      email: 'omranmodern.co@gmail.com',
      sameAs: [
        'https://www.instagram.com/omranmodern/',
        'https://www.linkedin.com/company/omranmodern',
        'https://www.facebook.com/omranmodern.co',
        'https://pinterest.com/omranmodern',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+982154406012',
        contactType: 'customer service',
        areaServed: 'IR',
        availableLanguage: 'Persian',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Tehran Province, Tehran, District 16, Farjam St',
        addressLocality: 'Tehran, Iran',
        postalCode: '1681963113',
        areaServed: {
          '@context': 'https://schema.org',
          '@type': 'Place',
          hasMap: 'https://goo.gl/maps/DbxahFJCrSEiVExX7',
        },
        addressCountry: {
          '@type': 'Country',
          name: 'Iran',
        },
      },
    },
    search: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      id: 'https://www.omranmodern.com/#webSite',
      name: 'عمران مدرن',
      url: 'https://www.omranmodern.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.omranmodern.com/search/?q={search_term_string}',
        'query-input': {
          '@type': 'PropertyValueSpecification',
          valueRequired: 'http://schema.org/True',
          valueName: 'search_term_string',
        },
      },
      copyrightHolder: {
        '@type': 'Corporation',
        id: 'https://www.omranmodern.com/#corporation',
        name: 'عمران مدرن',
      },
      creator: {
        '@type': 'Corporation',
        id: 'https://www.omranmodern.com/#corporation',
        name: 'عمران مدرن',
      },
    },
  };

  FAQPageSchema;
  productSchema;
  breadcrumbListSchema;

  defaultDescription = '';

  // tslint:disable-next-line: variable-name
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  removeStructuredData(): void {
    const els = [];
    ['corporation', 'faq', 'product', 'breadcrumb'].forEach((c) => {
      els.push(...Array.from(this._document.head.getElementsByClassName(c)));
    });
    els.forEach((el) => this._document.head.removeChild(el));
  }

  insertSchema(type = 'custom', customSchema: any = null): void {
    let script;
    let schema;
    if (type === 'corporation') {
      schema = this.orgSchema;
    } else if (type === 'website') {
      schema = this.websiteSchema;
    } else if (type === 'faq') {
      schema = this.FAQPageSchema;
    } else if (type === 'product') {
      schema = this.productSchema;
    } else if (type === 'breadcrumb') {
      schema = this.breadcrumbListSchema;
    } else if (type === 'custom') {
      schema = customSchema;
    }

    let shouldAppend = false;
    if (this._document.head.getElementsByClassName(type).length) {
      script = this._document.head.getElementsByClassName(type)[0];
    } else {
      script = this._document.createElement('script');
      shouldAppend = true;
    }
    script.setAttribute('class', type);
    script.type = JsonLDService.scriptType;
    script.text = JSON.stringify(schema);
    if (shouldAppend) {
      this._document.head.appendChild(script);
    }
  }

  // createProductSchema(product, type): void {
  //   const description = this.createDescription(product, type);
  //   const aggregateRating = {
  //       ratingValue: product.content_rate.rate_average,
  //       reviewCount: product.content_rate.number_of_user_rates
  //     };
  //
  //   const schema = { Product: {
  //     '@context': 'https://schema.org/',
  //         '@type': 'Product',
  //         name: product.name ,
  //         image: 'https://omranmodern.com' + product.images[0],
  //         description,
  //       category : 'https://omranmodern.com/category/' + product.category.slug,
  //       aggregateRating: {
  //               '@type': 'AggregateRating',
  //               ratingValue: aggregateRating.ratingValue,
  //               reviewCount: aggregateRating.reviewCount
  //       },
  //         offers: {
  //               '@type': 'AggregateOffer',
  //               offerCount: this.general.numberOfProducts() === 0 ? 1 : this.general.numberOfProducts(),
  //               lowPrice: product.price_range.min === 0 ? '' : product.price_range.min,
  //               highPrice: product.price_range.max === 0 ? '' : product.price_range.max,
  //               priceCurrency: 'IRR',
  //             itemCondition: 'https://schema.org/NewCondition',
  //             availability: 'https://schema.org/InStock'
  //             }
  //             }
  //             };
  //   this.productSchema = schema;
  //   this.insertSchema('product');
  // }

  createFAQSchema(faqs: Array<any>, url): void {
    const faqArray: Array<any> = [];
    for (const faq of faqs) {
      faqArray.push({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.reply,
        },
      });
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': url + '/#FAQPage',
      mainEntity: faqArray,
    };
    this.FAQPageSchema = schema;
    this.insertSchema('faq');
  }

  createBreadcrumbSchema(breadcrumb, cluster = null): void {
    const ancestors = [];
    ancestors.push({
      '@type': 'ListItem',
      position: 1,
      item: {
        '@id': 'https://omranmodern.com',
        name: 'عمران مدرن',
      },
    });
    let counter = 2;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < breadcrumb.length; index++) {
      ancestors.push({
        '@type': 'ListItem',
        position: counter,
        item: {
          '@id': 'https://omranmodern.com/category/' + breadcrumb[index].slug,
          name: breadcrumb[index].name,
        },
      });
      counter++;
    }
    if (cluster) {
      ancestors.push({
        '@type': 'ListItem',
        position: counter,
        item: {
          '@id': 'https://omranmodern.com/category/' + cluster.slug,
          name: cluster.name,
        },
      });
    }

    const schema = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: ancestors,
    };
    this.breadcrumbListSchema = schema;
    this.insertSchema('breadcrumb');
  }

  // createDescription(product, type): string {
  //   let description = '';
  //   const date = new Date();
  //   if (product.description === '') {
  //     description = this.general.productDescription(type, product.name, this.persianDate.transform(date),
  //     product.price_range.min, product.price_range.max);
  //   } else {
  //     description = this.general.productDescription(type, product.description, this.persianDate.transform(date),
  //     product.price_range.min, product.price_range.max);
  //   }
  //   return description;
  // }
}
