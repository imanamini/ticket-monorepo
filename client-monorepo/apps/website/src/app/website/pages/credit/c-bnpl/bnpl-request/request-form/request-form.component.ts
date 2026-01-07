import {Component, EventEmitter, Inject, inject, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription, take} from 'rxjs';
import {LoggedInUser} from '../../../../../../api/digipay/models/logged-in-user.model';
import {UserService} from '../../../../../../core/services/user.service';
import {validateNationalCode} from '../../../../../../core/validators/national-id.validator';
import {ContactClient} from '../../../../../../api/clients/contact-client';
import {MessageService} from '@client-monorepo/common/utilities';
import moment from 'jalali-moment';
import {ActivatedRoute} from '@angular/router';
import {DeviceService} from '../../../../../../core/services/device/device.service';
import {WebViewService} from '../../../../../../core/services/web-view.service';
import {UiButtonComponent} from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {UiFormFieldBuilderModule} from '@digipay/ui-form-field-builder';
import {isPlatformBrowser, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {UiIconDirective} from '../../../../../../ui/ui-directive/ui-icon.directive';
import {NgxEventTrackerService} from '@digipay/ngx-event-tracker';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgOptimizedImage, ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent, UiIconDirective],
})
export class RequestFormComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;

  submittedForm = false;

  dateInputBounds: {
    startTimestamp: number;
    endTimestamp: number;
  };

  subscriptions: Subscription[] = [];

  isSubmitting = false;

  @Output() navigateToCBnplClicked: EventEmitter<any> = new EventEmitter();

  isWebView = false;
  private eventService = inject(NgxEventTrackerService);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private deviceService: DeviceService,
    private contactClientService: ContactClient,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private webViewService: WebViewService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
  }

  ngOnInit(): void {
    this.isWebView = this.webViewService.isWebView();
    this.checkLogin();

    this.setDateInputBoundaries();

    this.subscriptions[0] = this.userService.loggedInUser.pipe(take(2)).subscribe((userData: LoggedInUser) => {
      if (userData && !this.contactForm) {
        this.contactForm = this.fb.group({
          firstName: [userData?.name, Validators.required],
          lastName: [userData?.surname, Validators.required],
          cellNumber: [userData?.cellNumber, Validators.pattern('09[0-9]{9}')],
          birthDate: [userData?.birthDate, Validators.required],
          nationalCode: [userData?.nationalCode, [this.nationalCodeValidator, Validators.required]],
        });
      }
    });
  }

  nationalCodeValidator(control: AbstractControl): { [s: string]: boolean } {
    if (validateNationalCode(control.value)) {
      return null;
    }

    return {invalidNationalCode: true};
  }

  setDateInputBoundaries() {
    const startYear = new Date();
    startYear.setFullYear(startYear.getFullYear() - 70);

    const endYear = new Date();
    endYear.setFullYear(endYear.getFullYear() - 18);

    this.dateInputBounds = {
      startTimestamp: startYear.getTime(),
      endTimestamp: endYear.getTime(),
    };
  }

  public submitRequest() {
    this.checkLogin();
    this.isSubmitting = true;
    const birthDateTimeStamp = this.contactForm.value.birthDate;
    const formData = {
      ...this.contactForm.value,
      birthDate: moment(birthDateTimeStamp).locale('fa').format('YYYY/MM/DD'),
    };
    const formId = this.activatedRoute.snapshot.queryParams['formId'];
    if (!formId) {
      return;
    }
    this.contactClientService.submitContactForm(formId, formData).subscribe({
      next: () => {
        this.submittedForm = true;
        const queryObject = new URLSearchParams();
        const queryParams = this.route.snapshot.queryParams;
        for (const key in queryParams) {
          queryObject.set(key, queryParams[key]);
        }
        this.userService.currentUser().then((user) => {
          this.eventService.sendEvent({
            userId: user.userId,
            eventName: 'GetBNPL_FC',
            eventData: queryObject,
          });
        });
      },
      error: (err) => {
        this.messageService.showErrorMessage(err.error.errors[0]);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  checkLogin(): boolean {
    if (!this.userService.isLoggedIn.getValue()) {
      this.navigateToCBnplClicked.emit();
      return false;
    }
    return true;
  }

  goToCBnpl() {
    this.navigateToCBnplClicked.emit();
  }

  goToApp() {
    if (this.isWebView) {
      this.webViewService.close();
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `https://click.adtrace.io/zer1jwf`;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
