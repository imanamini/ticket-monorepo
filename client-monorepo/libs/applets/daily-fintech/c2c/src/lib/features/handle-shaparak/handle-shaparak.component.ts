import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { CommonModule } from '@angular/common';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'c2c-applet-handle-shaparak',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './handle-shaparak.component.html',
  styleUrls: ['./handle-shaparak.component.scss'],
})
export class HandleShaparakComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly bottomNavigationService = inject(NgxBottomNavigationService);
  private readonly destroyRef = inject(DestroyRef);

  type = '';

  c2cId = '';

  constructor() {
    this.getParams();
  }

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (params['data']) {
        const data = decodeURIComponent(params['data']);
        // javascript normal decode (atob function)
        // did'nt work for this string and we should
        // use this third-party tool for doing this
        const decodedData = JSON.parse(Base64.decode(data));

        if (decodedData.cardInfo) {
          this.setRedirectUrl(decodedData);
        } else {
          this.router.navigateByUrl('service/c2c', {
            state: {
              shaparakState: 'failed',
              message: decodedData.result.message,
            },
          });
        }
      }
    });
  }

  getParams() {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      const { id, type } = params as { id: string; type: string };
      this.c2cId = id;
      this.setType(type);
    });
  }

  setType(type: string) {
    switch (type) {
      case 'update':
        this.type = 'update';
        break;
      case 'edit':
        this.type = 'edit';
        break;
      default:
        this.type = 'register';
    }
  }

  setRedirectUrl(data: any) {
    if (this.type === 'register' || (this.type === 'edit' && this.c2cId.length < 2)) {
      this.router.navigateByUrl(`service/c2c?card=${data.cardInfo.pan}`);
    } else if (this.c2cId.length > 1) {
      this.router.navigateByUrl(`service/c2c?id=${this.c2cId}`);
    } else if (this.type === 'update') {
      this.router.navigateByUrl(`service/c2c`);
    }
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
}
