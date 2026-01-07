import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { fixWebViewHtml } from '../../data-access/utils/strings';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-final-contract-page',
  templateUrl: './credit-final-contract-page.component.html',
  styleUrls: ['./credit-final-contract-page.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditFinalContractPageComponent implements OnInit {
  fundProviderCode!: number;
  creditId!: string;
  gettingData = signal<boolean | null>(null);
  htmlContent = signal<SafeHtml | null>(null);
  title = signal('قرارداد');
  defaultErrorMessage = 'متاسفانه مشکلی در نمایش قرارداد به وجود آمده است.';
  errorMessage = signal<string | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private creditApiService = inject(CreditApiService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private creditUrlService = inject(CreditUrlService);

  ngOnInit(): void {
    this.fundProviderCode = this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getData();
  }

  closeButton(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
  }

  private getData(): void {
    this.gettingData.set(true);
    this.creditApiService.getFinalContractPage(this.fundProviderCode, this.creditId).subscribe({
      next: (html) => {
        this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(fixWebViewHtml(html)));
        this.gettingData.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error && error.result && error.result.message ? error.result.message : this.defaultErrorMessage);
        this.gettingData.set(false);
      },
    });
  }
}
