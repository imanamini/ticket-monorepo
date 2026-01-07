import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ContactClient} from "../../../../../api/clients/contact-client";
import {DialogBottomSheetService} from "../../../../../core/services/dialog-bottom-sheet.service";
import {NgxFormValidator} from "@digipay/ngx-form-validator";
import {FormFieldComponent} from "@digipay/ui-form-field-builder";
import {NgxButtonComponent} from "@digipay/ngx-button";

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesFormComponent implements OnInit {

  form: UntypedFormGroup;
  private formBuilder = inject(UntypedFormBuilder);

  @Input() templateData!: any;
  @ViewChild('error') errorEl!: ElementRef;
  isMobileMode = false;


  errorText = '';

  constructor(private contactClient: ContactClient,
              private dialog: DialogBottomSheetService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private cdr:ChangeDetectorRef) {
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileMode = window.innerWidth <= 1280;
    }
    this.form = this.formBuilder.group({
      cellNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    })
    this.form.get('cellNumber')?.valueChanges.subscribe(() => {
      this.errorText = '';

    });
  }

  data: any;

  responseMessage = '';

  submitted = false;
  showFrom = true;
  errors: string[] = [];

  sendRequest() {
    this.submitted = true;
    this.errorText = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorText = 'شماره همراه را وارد کنید.';
      return;
    }

    const value = this.form.value;
    const data = {
      title: 'شماره‌ات ثبت شد. به محض اینکه شروع شد خبرت می‌کنیم!',
      // description: 'درخواست شما با موفقیت ثبت شد و در اولین فرصت با شما تماس خواهیم گرفت.',
    };

    this.contactClient.submitContactForm('shahrivar-auction', value).subscribe({
      next: (res) => {
        this.submitted = false;
        this.showFrom = false;
        this.data = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.submitted = false;
        this.showFrom = true;
        this.errorText = 'متاسفانه ارسال با خطا مواجه شد. لطفا دوباره تلاش کن';
        this.cdr.markForCheck();
      }
    });
  }


}

