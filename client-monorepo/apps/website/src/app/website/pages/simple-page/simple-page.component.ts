import { Component, OnInit } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { ContactForm } from '../../../api/clients/models/templates/contact-us/contact-form';
import { SimpleTemplateData } from '../../../api/clients/models/templates/simple/simple-template-data';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { DomSanitizer } from '@angular/platform-browser';
import { UiContactSectionComponent } from '../../../ui/ui-components/ui-contact/ui-contact-section/ui-contact-section.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-simple',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgIf, UiContactSectionComponent],
})
export class SimplePageComponent implements OnInit {
  page: Page<SimpleTemplateData>;

  contactForm!: ContactForm;

  loaded = false;

  constructor(
    private pageClient: PageClient,
    private route: ActivatedRoute,
    private seo: SeoService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const map = this.route.snapshot.params as any;
    if (map.slug) {
      this.getPageData('landing', map.slug);
    } else {
      this.route.data.subscribe((data) => {
        this.getPageData(data['prefix'], data['slug']);
      });
    }
  }

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private getPageData(prefix: string, slug: string) {
    this.pageClient.getPage(prefix, slug).subscribe(
      (res) => {
        this.page = res.page;
        this.seo.setGlobalMetaTagsFromPage(res.page);
        this.contactForm = res.contactForms[0];
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      },
      () => {
        let path = this.router.url;
        if (path.slice(-1) === '.') {
          path = path.substring(0, path.length - 1);
        }
        this.router.navigate([path], { skipLocationChange: true });
      },
    );
  }
}
