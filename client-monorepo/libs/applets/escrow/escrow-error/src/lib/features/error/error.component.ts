import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'escrow-error-applet-error',
  standalone: true,
  imports: [CommonModule, NgxStatusResultModule],
  templateUrl: './error.component.html',
  styles: `
    .error {
      height: 100% !important;
      position: absolute !important;
      z-index: 9999999999 !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  route = inject(ActivatedRoute);
  button = signal<Buttons[]>([
    {
      id: '',
      style: 'tinted-on-elevated',
      mode: 'section',
      label: 'بازگشت به دیوار',
    },
  ]);
  redirectUrl = signal<string>('');
  errorMessage = signal<string>('');
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.listenToQueryParams();
  }

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        take(1),
        map((params) => ({
          redirectUrl: params.get('redirectUrl') || '',
          errorMessage: params.get('errorMessage') || '',
        })),
      )
      .subscribe(({ redirectUrl, errorMessage }) => {
        this.redirectUrl.set(redirectUrl);
        this.errorMessage.set(errorMessage);
      });
  }

  redirect() {
    if (this.redirectUrl()) {
      window.location.href = this.redirectUrl();
    }
  }
}
