import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { SeoContent } from '../seo-content';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgClass, NgIf, NgStyle } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-ui-seo',
  templateUrl: './ui-seo.component.html',
  styleUrls: ['./ui-seo.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, UiButtonComponent, UiIconDirective, NgClass],
})
export class UiSeoComponent implements AfterViewInit {
  @Input()
  seoContent: SeoContent;

  @Input()
  backgroundColor = '#fff';

  isExpanded = false;

  shortenedHeight: string;

  expandedHeight: string;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  toggleState() {
    this.isExpanded = !this.isExpanded;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const elementSection = document.getElementById('seo-content');
      if (elementSection) {
        this.expandedHeight = elementSection.offsetHeight + 'px';

        this.finishOpening().subscribe({
          next: () => {
            const tmp = <HTMLParagraphElement>elementSection.firstChild;
            this.shortenedHeight = tmp.offsetHeight + 'px';
          },
        });
      }
    }
  }

  private finishOpening(): Observable<string> {
    return of('').pipe(delay(1));
  }
}
