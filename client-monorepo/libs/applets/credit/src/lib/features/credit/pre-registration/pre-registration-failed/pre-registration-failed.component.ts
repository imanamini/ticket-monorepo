import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PreRegistrationService } from '../services/pre-registration.service';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditUrlService } from '../../data-access/utils/url';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-pre-registration-failed',
  templateUrl: './pre-registration-failed.component.html',
  styleUrls: ['./pre-registration-failed.component.scss'],
  imports: [NgxStatusResultModule, CreditAppBarComponent, NgxAlert, NgxCalloutComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationFailedComponent implements OnInit {
  buttons: Buttons[] = [
    {
      id: 'creditPreRegistrationFailedButton',
      style: 'fill',
      label: 'متوجه شدم',
      mode: 'form',
      fullWidth: true,
    },
  ];
  errorType = signal<'DUPLICATE_CELL_NUMBER' | 'DUPLICATE_NATIONAL_ID' | null>(null);
  cellNumber = signal<string | null>(null);
  dataMapper = computed(() => ({
    DUPLICATE_CELL_NUMBER: {
      title: 'محدودیت در انتخاب چند طرح',
      description: 'امکان دریافت چند طرح اعتباری به صورت هم‌زمان وجود ندارد.',
      alert: null,
      calloutMessages: ['برای دریافت این طرح اعتباری ابتدا درخواست قبلی خود را لغو کنید، سپس برای دریافت اعتبار جدید اقدام کنید.'],
    },
    DUPLICATE_NATIONAL_ID: {
      title: 'محدودیت در انتخاب چند طرح',
      description: `پرونده اعتباری دیگری با این کدملی و شماره همراه ${this.cellNumber()} ساخته شده است.`,
      alert: 'توجه داشته باشید تا لغو کامل درخواست قبلی امکان تشکیل پرونده با شماره همراه جدید وجود ندارد.',
      calloutMessages: ['برای ایجاد پرونده اعتباری جدید، ابتدا با شماره همراه بالا وارد شوید و درخواست قبلی خود را لغو کنید.'],
    },
  }));

  data = computed(() => this.dataMapper()[this.errorType()!]);

  creditUrlService = inject(CreditUrlService);
  router = inject(Router);
  private preRegistrationService = inject(PreRegistrationService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const cellNumber = this.activatedRoute.snapshot.queryParams['cellNumber'];
    if (cellNumber) {
      this.cellNumber.set(cellNumber);
      this.errorType.set('DUPLICATE_NATIONAL_ID');
    } else {
      this.errorType.set('DUPLICATE_CELL_NUMBER');
    }
  }

  close() {
    this.preRegistrationService.closeFlow();
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
  }

  protected readonly alert = alert;
}
