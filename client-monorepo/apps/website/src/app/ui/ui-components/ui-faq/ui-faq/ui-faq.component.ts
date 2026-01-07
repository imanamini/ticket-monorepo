import {
  Component,
  EventEmitter,
  Inject, input,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT, NgIf, NgFor, NgClass, Location, isPlatformBrowser} from '@angular/common';
import {JsonLDService} from '../../../../core/services/json-ld.service';
import {delay, Observable, of} from 'rxjs';
import {FaqItem} from "../../../../api/clients/models/templates/services/faq";

@Component({
  selector: 'app-ui-faq',
  templateUrl: './ui-faq.component.html',
  styleUrls: ['./ui-faq.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
})
export class UiFaqComponent implements OnInit, OnDestroy {
  @Input() faqs: FaqItem[] = [];

  @Input() title = '';

  @Input() subtitle = '';

  @Input() idKey: string = null;

  openItemIndex: number | null = null;

  @Output() itemOpened = new EventEmitter<FaqItem>();
  blackFridayMode = input(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    private jsonLDService: JsonLDService,
  ) {
  }

  ngOnInit(): void {
    this.insertFaqSchemaIfNeeded();

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.finishOpening().subscribe(() => {
          this.scrollToAnchor(fragment);
          this.openFaqById(fragment);

          this.router.navigate([], {
            fragment,
            queryParamsHandling: 'merge',
            preserveFragment: true,
            replaceUrl: true,
          });
        });
      }
    });

    const key = this.idKey || 'faq';

    this.route.queryParams.subscribe((map) => {
      if (map[key]) {
        this.finishOpening().subscribe(() => {
          const faqId = this.idKey ? map[key] : 'target' + map.faq;
          this.scrollToAnchor(faqId);
          this.openFaqById(faqId);

          this.router.navigate([], {
            fragment: faqId,
            queryParamsHandling: 'merge',
            preserveFragment: true,
            replaceUrl: true,
          });
        });
      }
    });
  }

  private openFaqById(id: string) {
    this.faqs.forEach((faq, index) => {
      if (faq.itemId === id || ('target' + (index + 1)) === id) {
        this.openItemFaq(index);
      }
    });
  }


  private finishOpening(): Observable<string> {
    return of('').pipe(delay(1));
  }

  openItemFaq(index: number | null) {
    if (this.openItemIndex === index) {
      this.openItemIndex = -1;
    } else {
      this.openItemIndex = index;
      this.itemOpened.emit(this.faqs[index]);
    }
  }

  scrollToAnchor(elementId: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({block: 'center', behavior: 'smooth'});
    }
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    const div = this.document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').trim();
  }

  private insertFaqSchemaIfNeeded() {
    if (!this.faqs?.length) return;

    const pageUrl = this.document.location.href.split('#')[0] || '';
    const mainEntity = this.faqs.map((faq, index) => {
      const anchor = faq.itemId ? faq.itemId : 'target' + (index + 1);
      return {
        '@type': 'Question',
        name: faq.question,
        url: pageUrl + '#' + anchor,
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.stripHtml(faq.answer)
        }
      };
    });

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': pageUrl,
          name: this.title || this.document.title,
          hasPart: [{'@id': pageUrl + '#faq'}]
        },
        {
          '@type': 'FAQPage',
          '@id': pageUrl + '#faq',
          isPartOf: {'@id': pageUrl},
          mainEntity
        }
      ]
    };
    this.jsonLDService.FAQPageSchema = schema;
    this.jsonLDService.insertSchema('faq');
  }


  ngOnDestroy(): void {
    this.jsonLDService.removeStructuredData();
  }
}
