import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageClient } from '../../../api/clients/page-client';
import { Router } from '@angular/router';
import { UiSpinnerComponent } from '../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { isPlatformBrowser, NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, UiButtonComponent, UiSpinnerComponent],
})
export class NotFoundPageComponent implements OnInit {
  displayNotFound = false;

  constructor(
    private pageClient: PageClient,
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    let path = this.router.url;
    if (path.slice(-1) === '.') {
      path = path.substring(0, path.length - 1);
    }
    if (isPlatformBrowser(this.platformId)) {
      this.pageClient.checkRedirection(path).subscribe({
        next: (res) => {
          window.location.href = res.redirectTo;
        },
        error: () => {
          document.getElementById('app-loading')?.classList.add('loaded');
          this.displayNotFound = true;
        },
      });
    }
  }
}
