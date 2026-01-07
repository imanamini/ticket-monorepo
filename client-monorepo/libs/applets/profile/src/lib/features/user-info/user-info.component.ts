import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ProfileInterface, UserApiService } from '@client-monorepo/common/user';
import { Subscription } from 'rxjs';
import { ApiImageModule, ApiImageService } from '@digipay/ng-ui-api-image';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { makeEmptyPropsNull, MessageService } from '@client-monorepo/common/utilities';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ProfilePhotoCompressConfig } from '../../data-access/constants/profile-photo-compress-config.const';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

@Component({
  selector: 'profile-applet-user-info',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ApiImageModule,
    NgxSkeletonLoadingComponent,
    PipesModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    DpIconComponent,
    NgxButtonComponent,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userApiService = inject(UserApiService);
  apiImageService = inject(ApiImageService);
  messageService = inject(MessageService);
  actionHandlerService = inject(ActionHandlerService);
  private ngxHybridService = inject(NgxHybridService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('uploader') uploader!: ElementRef;
  @ViewChild('profileImage') profileImage!: ElementRef;
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  fileUploading = signal<boolean>(false);
  user = signal<ProfileInterface | null>(null);
  isShahkarErrorMessage = signal(false);
  showErrorMessage = signal(false);
  private isAndroidHybrid = signal(false);
  private destroyed = false;
  profileSubscription!: Subscription;
  genderOptions = [
    {
      title: 'مرد',
      value: '1',
    },
    {
      title: 'زن',
      value: '2',
    },
  ];
  primaryForm!: FormGroup;
  addressForm!: FormGroup;
  bottomNavigationService = inject(NgxBottomNavigationService);
  ngOnInit() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    this.bottomNavigationService.hide();
    this.initPage();
    this.isAndroidHybrid.set(this.ngxHybridService.isAndroidHybrid());
    if (this.isAndroidHybrid()) {
      this.ngxHybridService.disableScreenshot();
    }
  }

  ngOnDestroy() {
    this.profileSubscription?.unsubscribe();
    this.bottomNavigationService.show();
    if (this.isAndroidHybrid()) {
      this.ngxHybridService.enableScreenshot();
    }
  }
  isEmailCharacter(input: string): boolean {
    const regex = /[a-zA-Z0-9._\-@\s]/g;
    return regex.test(input);
  }

  initForm(): void {
    this.primaryForm = new FormGroup({
      name: new FormControl<string | null>(this.user()?.name ?? null, [Validators.maxLength(20), Validators.minLength(2)]),
      surname: new FormControl<string | null>(this.user()?.surname ?? null, [Validators.maxLength(30), Validators.minLength(2)]),
      gender: new FormControl<string | null>(this.user()?.gender?.toString() ?? '1', []),
      birthDate: new FormControl<number | null>(this.user()?.birthDate ?? null, []),
      nationalCode: new FormControl<string | null>(this.user()?.nationalCode ?? null, [
        Validators.required,
        NgxFormValidator.nationalCodeValidator(),
        this.invalidNationalCodeValidator().bind(this),
      ]),
    });
    this.primaryForm.get('nationalCode')?.valueChanges.subscribe(() => {
      // Defer signal write to escape reactive context
      setTimeout(() => {
        if (!this.destroyed) {
          this.isShahkarErrorMessage.set(false);
        }
      }, 0);
    });

    this.addressForm = new FormGroup({
      email: new FormControl<string | null>(this.user()?.email?.email?.toString() ?? null, [Validators.email]),
      postalCode: new FormControl<string | null>(this.user()?.postalCode?.toString() ?? null, [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ]),
      phoneNumber: new FormControl<string | null>(this.user()?.phone?.number?.toString() ?? null, [
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern('^[0-9]*$'),
      ]),
      address: new FormControl<string | null>(this.user()?.address?.toString() ?? null, [
        Validators.minLength(12),
        Validators.maxLength(99),
      ]),
    });
    this.isLoading.set(false);
  }

  invalidNationalCodeValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return this.isShahkarErrorMessage() ? { invalidShahkar: true } : null;
    };
  }

  initPage(): void {
    this.profileSubscription = this.userApiService.getProfile().subscribe({
      next: (result) => {
        this.user.set(result);
        this.initForm();
      },
    });
  }

  submitForm(): void {
    if (this.primaryForm.valid && this.addressForm.valid && !this.isSubmitting()) {
      const sendData = {
        ...this.primaryForm.value,
        ...this.addressForm.value,
      };
      makeEmptyPropsNull(sendData);
      this.isSubmitting.set(true);
      this.userApiService.updateProfile(sendData).subscribe({
        next: (result) => {
          this.user.set(result);
          this.isSubmitting.set(false);
          this.messageService.showSuccessMessage('اطلاعات شما به روز شد');
        },
        error: (error) => {
          this.messageService.showErrorMessage(
            error.error.result.message ?? 'در به روز رسانی اطلاعات شما خطایی بوجود آمده است، لطفا مجدد تلاش کنید',
          );
          this.isSubmitting.set(false);
          if (error.error.result.status === 1054 && !error.error.errorMessages) {
            this.isShahkarErrorMessage.set(true);
          }
          this.showErrorMessage.set(true);
          this.primaryForm.get('nationalCode')?.updateValueAndValidity();
          setTimeout(() => {
            this.showErrorMessage.set(false);
          }, 100);
        },
      });
    }
  }

  getForm(type: string): FormGroup {
    switch (type) {
      case 'primary':
        if (this.primaryForm) {
          return this.primaryForm;
        }
        break;
      case 'address':
        if (this.addressForm) {
          return this.addressForm;
        }
        break;
    }
    return new FormGroup({});
  }

  handleUploadClick(): void {
    this.uploader?.nativeElement.click();
  }

  onImageSelect(event: any): void {
    const files = (event.target as HTMLInputElement)?.files;
    if (files) {
      const file = files[0];
      this.validateImage(file)
        .then((isValid) => {
          if (!isValid) {
            this.messageService.showErrorMessage('ابعاد تصویر باید ۱:۱ ۴:۳ ۱۶:۹ یا 3:2 باشد');
            this.uploader.nativeElement.value = null;
            return;
          }

          this.compressImage(file)
            .then((compressedBase64) => {
              this.uploadImage(compressedBase64);
            })
            .catch(() => {
              this.messageService.showErrorMessage('مشکلی در فشرده سازی تصویر بوجود آمده است');
            });
        })
        .catch(() => {
          this.messageService.showErrorMessage('مشکلی در پردازش تصویر بوجود آمده است');
        });
    }
  }

  validateImage(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        URL.revokeObjectURL(img.src);

        // Check if the aspect ratio is within the acceptable range
        if (ProfilePhotoCompressConfig.acceptableRatios.some((ratio) => Math.abs(ratio - aspectRatio) < 0.7)) {
          resolve(true);
        } else {
          resolve(false);
        }
      };
      img.onerror = reject;
    });
  }

  compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        let offsetX = 0,
          offsetY = 0,
          size = 0;
        if (img.width > img.height) {
          // Landscape image
          size = img.height;
          offsetX = (img.width - size) / 2;
        } else if (img.height > img.width) {
          // Portrait image
          size = img.width;
          offsetY = (img.height - size) / 2;
        } else {
          // Square image
          size = img.width;
        }
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64Data = (reader.result as string).split(',')[1];
                resolve(base64Data);
              };
            } else {
              reject(new Error('Operation failed'));
            }
          },
          ProfilePhotoCompressConfig.compressionFormat,
          ProfilePhotoCompressConfig.compressionRatio,
        );

        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
    });
  }

  uploadImage(base64File: string): void {
    this.fileUploading.set(true);
    this.userApiService.uploadAvatar({ file: base64File }).subscribe({
      next: (result) => {
        this.apiImageService.clearFromCache(result.fileId);
        this.user.set({
          ...this.user(),
          imageId: result.fileId,
        } as ProfileInterface);
        this.fileUploading.set(false);
        this.messageService.showSuccessMessage('تصویر پروفایل شما به روز شد');
      },
      error: () => {
        this.fileUploading.set(false);
        this.uploader.nativeElement.value = null;
        this.messageService.showErrorMessage('در به روز رسانی تصویر پروفایل مشکلی بوجود آمده است، لطفا مجدد تلاش کنید');
      },
    });
  }

  gotoSupport(): void {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: 'profile/about-us',
      },
    });
  }
}
