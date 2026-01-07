import { AfterViewInit, Component, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { GoogleTagManagerService } from './credit/core/services/google-tag-manager.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {

  // Services
  private gtmService = inject(GoogleTagManagerService);
  private router = inject(Router);

  // Variables
  private lastUrlAfterRedirect: string;
  private readonly regex = /[^?]*/;

  constructor() {
    this.setTagManagerConfig();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.gtmServiceRouterEvent();
    }, 0);
  }

  private setTagManagerConfig(): void {
    if (environment['google_tag_manager_id']) {
      this.gtmService.appendGtmToHeadHtml();
    }
  }

  private gtmServiceRouterEvent() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.saveCustomQueryParam();
        // Prevent sending duplicate page events to GTM after changing the query parameters in the dropdown.
        if (environment['name'] === 'production') {
          if (this.lastUrlAfterRedirect?.match(this.regex)[0] !== this.router.url.match(this.regex)[0]) {
            this.gtmService.pushOnDataLayer({
              event: 'page_event',
              page_url: event.urlAfterRedirects,
              old_page: this.lastUrlAfterRedirect ?? '/',
            });
            this.lastUrlAfterRedirect = this.router.url;
          }
        }
      }
    });
  }
}
