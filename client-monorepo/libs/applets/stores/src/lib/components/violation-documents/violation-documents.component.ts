import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxUploaderComponent } from '@digipay/ngx-uploader';
import { IFileUpload } from '@digipay/ngx-uploader/lib/data-access/models/uploader.interface';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { ViolationService } from '../../data-access/services/violation.service';
import { StoresApiService } from '@client-monorepo/stores';
import { SnackbarService } from '@digipay/ngx-snackbar';

@Component({
  selector: 'stores-applet-violation-documents',
  standalone: true,
  imports: [CommonModule, FormFieldComponent, TitleSummaryComponent, NgxUploaderComponent, NgxButtonComponent, ReactiveFormsModule],
  templateUrl: './violation-documents.component.html',
  styleUrl: './violation-documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationDocumentsComponent {
  // Injections
  formBuilder = inject(FormBuilder);
  violationService = inject(ViolationService);
  storesApi = inject(StoresApiService);

  // Variables
  form: UntypedFormGroup = this.formBuilder.group({
    description: ['', [Validators.required]],
  });
  fileUploaders = viewChildren<ElementRef>('fileUploader');
  nextId = 0;
  maximumImages = 3;
  files = signal<{ id: number; file?: IFileUpload }[]>([{ id: this.nextId++, file: undefined }]);
  showMoreImagesBtn = computed(() => this.files().length < 3);
  moreImagesBtnDisabled = computed(() => !this.files()[this.files().length - 1].file);
  description = signal<string | undefined>(undefined);
  maxImageSizeInKB = 300;
  snackbarService = inject(SnackbarService);

  addAnotherImage(): void {
    const length = this.files().length;
    if (length < this.maximumImages + 1) {
      this.files.update((v) => [...v, { id: this.nextId++, file: undefined }]);
      setTimeout(() => {
        this.clickLastUploader();
      }, 0);
    }
  }

  handleFilesUploaded(index: number, event: IFileUpload): void {
    const fileSize = event.file?.size;
    this.files.update((currentFiles) => {
      const updatedFiles = [...currentFiles];
      updatedFiles[index] = { ...updatedFiles[index], file: event };
      return updatedFiles;
    });
    if (fileSize && fileSize > this.maxImageSizeInKB * 1024) {
      this.snackbarService.openSnackBar({
        status: 'error',
        description: 'حداکثر سایز عکس ' + this.maxImageSizeInKB + ' کیلوبایت است.',
        message: 'خطا در بارگذاری',
      });
      this.removeImage(index);
    }
  }

  removeImage(index: number): void {
    if (this.files().length > 1) {
      this.files.update((currentFiles) => {
        const updatedFiles = [...currentFiles];
        updatedFiles.splice(index, 1);
        return updatedFiles;
      });
    } else if (this.files().length === 1) {
      this.files.set([{ id: this.nextId++, file: undefined }]);
    }
  }

  clickLastUploader(): void {
    const uploaders = this.fileUploaders();
    if (uploaders.length > 0) {
      const inputElement = uploaders[uploaders.length - 1]?.nativeElement?.querySelector('input.dg-file-input');
      if (inputElement) {
        inputElement.click();
      }
    }
  }

  handleSubmitDocuments(): void {
    this.violationService.documents.set({
      description: this.form.value['description'],
      files:
        this.files()
          .filter((i) => i.file !== undefined)
          .map((item) => item.file!) ?? [],
    });
    this.violationService.nextStep();
  }
}
