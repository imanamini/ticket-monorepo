import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CrowdInfoPipe } from '../pipes/crowd-info.pipe';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { CrowdIntroductionSegmentComponent } from './components/introduction/crowd-introduction-segment.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CrowdDocumentSegmentComponent } from './components/documents/crowd-document-segment.component';
import { CrowdCalendarSegmentComponent } from './components/calendar/crowd-calendar-segment.component';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { CROWD_LIST_ROUTE, PURCHASE_ROUTE } from '../../../data-access/constants/app-routes';
import { ProjectStatusDetailComponent } from '../components/project-status-detail/project-status-detail.component';
import { ActivatedRoute } from '@angular/router';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ImageComponent } from '../../../shared/components/image/image.component';
import { RiskBottomSheetComponent } from '../crowd-list/components/risk-bottom-sheet/risk-bottom-sheet.component';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CrowdFundingModel, ICrowdState } from '../data-access/models';
import { CrowdFundingService } from '../data-access/services/crowd-funding.service';

@Component({
  selector: 'app-crowd-detail',
  templateUrl: './crowd-detail.component.html',
  styleUrls: ['./crowd-detail.component.scss'],
  standalone: true,
  imports: [
    NgxAppBarComponent,
    CrowdInfoPipe,
    NgxCalloutComponent,
    NgxSegmentedControlComponent,
    CrowdIntroductionSegmentComponent,
    NgxButtonComponent,
    CrowdDocumentSegmentComponent,
    CrowdCalendarSegmentComponent,
    ProjectStatusDetailComponent,
    PipesModule,
    ImageComponent,
    SpinnerComponent,
    NgxDividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdDetailComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private bottomSheet = inject(NgxBottomSheetService);
  private crowdFundingService = inject(CrowdFundingService);
  private navigationService = inject(WealthNavigationService);

  loading = signal<boolean>(true);
  downloading = signal<boolean>(false);
  activeSegment = signal<number | string>(1);
  state = signal<ICrowdState | undefined>(undefined);
  symbol = signal<string | undefined>(undefined);
  crowd = signal<CrowdFundingModel | undefined>(undefined);
  options = signal<SegmentItemsModel[]>([
    { text: 'معرفی طرح', id: 1, value: 1, disable: false },
    { text: 'اسناد', id: 2, value: 2, disable: false },
    { text: 'تقویم پروژه', id: 3, value: 3, disable: false },
  ]);

  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit() {
    this.state.set(this.routeState.getAll());
    this.fetchCrowdProject();
  }

  private fetchCrowdProject() {
    this.symbol.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.crowdFundingService.getCrowdProject(this.symbol()).subscribe((res) => {
      if (res?.success) {
        this.crowd.set(res.result);
      }
      this.loading.set(false);
    });
  }

  showRisk() {
    this.bottomSheet.openBottomSheet(
      RiskBottomSheetComponent,
      {
        title: 'قبل از سرمایه‌گذاری این مطالب را مطالعه کنید:',
        topDescription: `« تامین مالی جمعی » به عنوان روشی برای سرمایه گذاری، مشابه سایر روش ها، متضمن ریسک هایی برای تامین کننده است و دانایان کراد به عنوان عامل مجاز، برخی از خطرات این سرمایه گذاری را در اجرای مواد ۲۹ و ۳۰ « دستورالعمل تامین مالی جمعی »، به شرح زیر به اطلاع تامین کنندگان محترم می رساند:`,
        bullets: [
          'در تامین مالی جمعی، متقاضی با استفاده از وجوه، اقدام به راه اندازی و توسعه کسب‌وکار اقتصادی برای تحصیل سود می نماید اما سودآوری طرح، قطعی نیست. علاوه بر این از آنجا که متقاضیان و تامین کنندگان مستند به ماده ۲ « دستورالعمل تامین مالی جمعی » در سود و زیان طرح ها شریک هستند، در صورت شکست یا انحراف طرح، احتمال ضرر یا از بین رفتن سرمایه تامین کننده، وجود دارد. ضمناً در صورت انحراف برنامه کسب و کار متقاضی از برنامه پیشبینی شده و نکول متقاضی در پرداخت، عامل در راستای حفظ منافع تامین کنندگان و در چارچوب قراردادهای مربوط، اقدامات مقتضی را انجام میدهد.',
          'با توجه به نبود ضامن نقدشوندگی طی دوره ( تا سررسید )، دسترسی به وجه سرمایه گذاری شده پیش از موعد سررسید و نقل و انتقال گواهی شراکت آن جز در صورت تجویز مقررات و با رعایت کلیه الزامات آنها، وجود نخواهد داشت.',
          'عامل در محدوده قوانین، مقررات و توافقات فیمابین، مسئول بررسی صحت اسناد و مدارک و ارائه خدمات مربوط به تامین مالی جمعی است. به همین دلیل، در راستای اجرای ماده ۳۲ »دستورالعمل تامین مالی جمعی« عامل توصیه به سرمایه گذاری در هیچ طرح خاصی نخواهد کرد. همچنین معرفی یا انتشار فراخوان طرح بدون اخذ نماد اختصاصی از فرابورس یا انجام اقدامات مربوط برای تامین مالی جمعی خارج از سکو، ممنوع و بالاثر می باشد.',
          'تامین مالی جمعی در بستر قوانین و مقررات مربوط انجام شده و کلیه ذینفعان ملزم به اطلاع و رعایت آنها هستند. تغییرات قوانین و مقررات نافی علم و آگاهی سرمایه گذاران نسبت به آن ها نبوده و نظارت کارگروه ارزیابی تامین مالی جمعی بر فرایند مربوط، سالب مسئولیت تامین کنندگان در کسب آگاهیهای مربوط و تعهد آنها به پذیرش ریسک‌های مطرح در سرمایه‌‌گذاری نخواهد بود.',
          'اعطای مجوز فعالیت به عامل توسط کارگروه ارزیابی تامین مالی جمعی و فرابورس ایران به منظور حصول اطمینان از رعایت قوانین و مقررات و شفافیت اطلاعاتی است. اعطای این مجوزها به معنی نظارت تمام عیار بر تمامی متقاضیان و تامین کنندگان یا تایید مزایا و تضمین سودآوری فعالیتهای آنها نبوده و هیچ یک از مجوزهای اعطاشده توسط فرابورس ایران مبنی بر تایید طرحی خاص یا توصیه به سرمایه گذاری در آن نیست. کارگروه ارزیابی تامین مالی جمعی و فرابورس ایران در خصوص ضرر و زیان ناشی از اتکا به تمام یا بخشی از مندرجات اسناد و مدارک مربوط، از خود سلب مسئولیت مینماید.',
          'اعلام ریسک‌های فوق به معنی سلب مسئولیت از عامل نبوده و از آنجا که عامل با  اطلاع   از قوانین و مقررات مربوط در حدود تکالیف مقرراتی، قراردادی و حرفهای خود اقدام به فعالیت مینماید، در صورت قصور یا تقصیر از تکالیف مذکور، حسب مورد از حیث مدنی، کیفری یا انضباطی مسئول خواهد بود. به هر ترتیب، سرمایه گذاران میتوانند در صورت مشاهده هر گونه تخلف از مقررات حاکم بر تامین مالی جمعی مراتب را با فرابورس ایران مکاتبه نمایند.',
        ],
        bottomDescription:
          'به موجب این سند، ( این جانب/ این شرکت ) اقرارنامه و بیانیه ریسک سرمایه گذاری در تامین مالی جمعی را دریافت و مطالعه نموده و ضمن اعلام اطلاع از کلیه قوانین، مقررات و خصوصیات این گونه از سرمایه گذاری و ریسک هایی که در آن متصور می باشد ( از جمله و نه محدود به ریسک‌های مورد اشاره در این سند ) مراتب را تایید نموده و با علم به آن ها در این زمینه فعالیت می‌نماید.',
      },
      {
        height: '70dvh',
        overflow: 'scroll',
        noPadding: true,
      },
    );

    const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      if (this.bottomSheet.outputData()) {
        this.navigationService.navigate([PURCHASE_ROUTE, this.crowd().symbol], {
          queryParams: { crowdFunding: 'true' },
        });
      }
    });
  }

  onBackHandler() {
    this.navigationService.navigate([CROWD_LIST_ROUTE], {
      state: {
        filters: this.state().filters,
      },
    });
  }

  getDocument() {
    this.downloading.set(true);
    fetch(this.crowd().participantReportFilePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', this.crowd().title);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url); // Clean up
        this.downloading.set(false);
      })
      .catch(() => {
        this.downloading.set(false);
      });
  }
}
