import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  HostListener, Inject,
  OnDestroy,
  OnInit, PLATFORM_ID, Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BaseLayoutComponent} from "../../../layout/base-layout/base-layout.component";
import {
  UiHorizontalFlowComponent
} from "../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component";
import {UiFaqComponent} from "../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component";
import {FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators} from "@angular/forms";
import {RegisterBenefits} from "../../../../api/clients/models/templates/c-credit/c-credit-template-data";
import {environment} from "../../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {PageDataService} from "../../../services/page-data.service";
import {NgxFormValidator} from "@digipay/ngx-form-validator";
import {BehaviorSubject, delay, of} from "rxjs";
import {thirdPartyInsuranceModel} from "../../../../api/digipay/models/thirdPartyInsurance.model";
import {InsuranceApiService} from "../../../../api/digipay/models/insurance-api-service";
import {LoadingService} from "../../marketing-campaigns/third-party-insurance/loading.service";
import {ThirdPartyInsuranceResponse} from "../../../../api/digipay/models/ThirdPartyInsurance-response";
import {UiFormFieldBuilderModule} from "@digipay/ui-form-field-builder";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {InsuranceBenefitComponent} from "./insurance-benefit/insurance-benefit.component";
import {OurPartnersComponent} from "./our-partners/ourPartners.component";
import {WaitingSpinnerComponent} from "./waiting-spinner/waiting-spinner.component";
import {NgxPlateComponent} from "@digipay/ngx-plate";

@Component({
  selector: 'app-third-party-insurance-v2',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, UiHorizontalFlowComponent, UiFaqComponent, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent, InsuranceBenefitComponent, OurPartnersComponent, WaitingSpinnerComponent, NgxPlateComponent],
  templateUrl: './third-party-insurance-v2.component.html',
  styleUrl: './third-party-insurance-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartyInsuranceV2Component implements OnInit, AfterViewInit, OnDestroy {

  loaded = false;

  creditCampaignPage!: any;

  contactForm!: any;

  digiPayBenefit: any;

  form: FormGroup;

  appUrl = environment.appUrl;

  constructor(
    private pageDataService: PageDataService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private renderer: Renderer2,
    private el: ElementRef,
    private InsuranceApiService: InsuranceApiService,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: string,
    private cdr: ChangeDetectorRef,
  ) {

    this.form = this.formBuilder.group({
      plate: ['', Validators.required],
      nationalCode: ['', [Validators.required, NgxFormValidator.nationalCodeValidator()]],
    });
  }

  isPlateComplete = new BehaviorSubject(false);
  isPlateComplete$ = this.isPlateComplete.asObservable();
  plateValue: number | null = null;

  loadingTitle = 'لطفا منتظر بمانید';
  loadingSubtitle = 'در حال استعلام اطلاعات بیمه خودروی شما';
  errorTitle = 'متاسفانه مشکلی پیش آمد';
  errorSubtitle = 'لطفا دوباره تلاش کنید.';

  @ViewChild('car') car!: ElementRef;
  @ViewChild('animationWrapper') animationWrapper!: ElementRef;
  @ViewChild('bubble') bubble!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('startBtn') btn: ElementRef<HTMLButtonElement>;

  animationPlayed = false;
  isPausedAtCenter = false;
  carMovedRight = false;

  @HostListener('window:scroll')
  checkScroll() {
    const rect = this.animationWrapper.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (
      !this.animationPlayed &&
      rect.top < windowHeight &&
      rect.bottom > 0
    ) {
      this.playAnimation();
      this.animationPlayed = true;
      return;
    }


    if (
      this.isPausedAtCenter &&
      !this.carMovedRight &&
      rect.top < windowHeight &&
      rect.bottom > 0
    ) {
      this.moveCarToRight();
      this.carMovedRight = true;
      return;
    }

    if (rect.bottom < 80 || rect.top > windowHeight) {
      this.resetAnimationState();
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    if(isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  headerElement;

  ngOnInit(): void {

    this.isPlateComplete$.subscribe(isPlateComplete => {
      if (isPlateComplete && this.plateValue) {
        this.form.patchValue({plate: this.plateValue});
      } else {
        this.form.patchValue({plate: ''});
      }

    })

    let benefits = [];
    benefits.push(
      {
        icon: '/assets/insurance/image1.svg',
        iconActive: '/assets/insurance/image1Active.svg'
        , text: 'خرید اقساطی در ۴ قسط ',
        text2: 'بدون نیاز به چک و سفته',
        isActive: false
        , shortText: 'خرید اقساطی'
      });
    benefits.push(
      {
        icon: '/assets/insurance/image2.svg',
        iconActive: '/assets/insurance/image2Active.svg',
        text: 'قیمت مناسب منطقی',
        text2: 'و مقرون‌به‌صرفه',
        isActive: false
        , shortText: 'مقرون‌به‌صرفه'
      });
    benefits.push(
      {
        icon: '/assets/insurance/image3.svg',
        iconActive: '/assets/insurance/image3Active.svg',
        text: 'مقایسه و انتخاب',
        text2: 'مناسب‌ترین بیمه',
        isActive: false
        , shortText: 'تنوع بیمه'
      });


    this.digiPayBenefit = {
      title: 'مزایای خرید بیمه شخص ثالث دیجی‌پی',
      subtitle: 'بیمه شخص ثالث، آرامش خاطر در رانندگی را با پوشش خسارات مالی و جانی ناشی از حوادث رانندگی برای شما و دیگران به ارمغان می‌آورد.',
      benefits: benefits,
    };

    this.route.url.subscribe(segments => {
      this.pageDataService.getPageData('insurtech', segments[0].path).subscribe(res => {

        if (isPlatformBrowser(this.platformId)) {
          this.creditCampaignPage = res.page;
          this.loaded = true;
          this.cdr.detectChanges();
          of('').pipe(delay(0)).subscribe(() => {
            if (!this.videoPlayer || !this.btn) return;

            const vid: HTMLVideoElement = this.videoPlayer.nativeElement;
            vid.muted = true;
            vid.load();

            this.btn.nativeElement.click();
            this.checkScreenSize();
          });
        }

      });
    });
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'background-color', '#F2F3F6');
    }

  }

  startVideo() {
    this.videoPlayer.nativeElement.play().catch(() => {/* swallow */
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'background-color');
    }

  }

  get setDisabled() {
    return !this.form.valid;
  }

  playAnimation() {
    // 1) Car slides from off‐screen left → center (over 1.5s)
    this.car.nativeElement.style.transition = 'transform 1.5s ease-in-out';
    this.car.nativeElement.style.transform = 'translateX(-50%)';

    // 2) After it finishes (1.5s), pop the bubble
    setTimeout(() => {
      this.bubble.nativeElement.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
      this.bubble.nativeElement.style.transform = 'translate(-35%, -80%) scale(1.8)';
      this.bubble.nativeElement.style.opacity = '0.5';

      // 3) As soon as the bubble “pop” is done (0.5s), we consider the car “paused at center”
      setTimeout(() => {
        this.isPausedAtCenter = true;
        // (Note: We do NOT automatically move the car to the right here anymore.)
      }, 500);

    }, 1500);
  }

  moveCarToRight() {
    this.car.nativeElement.style.transition = 'transform 3s ease-in-out';
    this.car.nativeElement.style.transform = 'translateX(500%)';
  }

  private resetAnimationState() {
    if (!this.animationPlayed && !this.isPausedAtCenter && !this.carMovedRight) {
      return;
    }

    this.animationPlayed = false;
    this.isPausedAtCenter = false;
    this.carMovedRight = false;
    this.car.nativeElement.style.transition = 'none';
    void this.car.nativeElement.offsetHeight;
    this.car.nativeElement.style.transform = 'translateX(-220%)';

    this.bubble.nativeElement.style.transition = 'none';
    void this.bubble.nativeElement.offsetHeight;
    this.bubble.nativeElement.style.transform = 'translate(-35%, -80%) scale(1.8)';
    this.bubble.nativeElement.style.opacity = '0';
  }

  checkScreenSize() {
    const sectionElement = this.el.nativeElement.querySelector('.section-registering');
    const videoElement = this.el.nativeElement.querySelector('.video-wrapper');
    if (!sectionElement || !videoElement) {
      return;
    }
    const containerDiv = sectionElement.querySelector('.container');
    const videoContainer = videoElement.querySelector('.container');

    if (containerDiv && videoContainer) {
      if (window.innerWidth <= 768) {
        this.renderer?.removeClass(containerDiv, 'container');
        this.renderer?.removeClass(videoContainer, 'container');
      } else {
        this.renderer?.addClass(containerDiv, 'container');
        this.renderer?.addClass(videoContainer, 'container');
      }
    }

  }

  noPlateInsurance() {
    let thirdPartyInsuranceInput: thirdPartyInsuranceModel = {
      license: null,
      nationalCode: null,
    };
    this.loadingService.showLoading(this.loadingTitle, this.loadingSubtitle);
    this.thirdPartyInsuranceApi(thirdPartyInsuranceInput, false);
  }

  thirdPartyInsuranceApi(input, hasPlate: Boolean) {
    this.InsuranceApiService.thirdPartyInsurance(input).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.loadingService.hide();
            if (hasPlate) {
              const url = `${this.appUrl}/mini-app/insurance/vehicle/third-party/sanhab?id=${res.result.id}&referrer=website`;
              window.location.href = url;
            } else {
              const url = `${this.appUrl}/mini-app/insurance/vehicle/third-party/car-info?id=${res.result.id}&jt=noSanhab&referrer=website`;
              window.location.href = url;
            }
          }
        },
        error: () => {
          this.loadingService.showError(this.errorTitle, this.errorSubtitle);
        }
      }
    )

  }

  buyInsurance() {
    let thirdPartyInsuranceInput: thirdPartyInsuranceModel = {
      license: this.form.get('plate').value,
      nationalCode: this.form.get('nationalCode').value
    };
    this.loadingService.showLoading(this.loadingTitle, this.loadingSubtitle);
    if(isPlatformBrowser(this.platformId)) {
      this.thirdPartyInsuranceApi(thirdPartyInsuranceInput, true);
    }
  }

  plateComplete(isPlateComplete: boolean) {
    this.isPlateComplete.next(isPlateComplete);
  }

  setPlateValue(plate: number) {
    this.plateValue = plate;
  }

  ngAfterViewInit(): void {
    if (this.car && this.bubble) {
      // this.car.nativeElement.style.transform = 'translateX(-100%)';
      this.bubble.nativeElement.style.transform = 'translate(-50%, -50%) scale(0)';
    }
  }
}
