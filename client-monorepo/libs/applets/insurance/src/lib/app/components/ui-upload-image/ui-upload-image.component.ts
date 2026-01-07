import {
  Component, computed,
  EventEmitter,
  input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import { UploadImageStates } from './enums/upload-image-states.enum';
import { NgClass, NgOptimizedImage, NgStyle, NgTemplateOutlet } from '@angular/common';
import { UiProgressBarComponent } from '../ui-progress-bar/ui-progress-bar.component';
import heic2any from 'heic2any';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { UploadMessageTypesEnum } from './enums/upload-message-types.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataUrl } from 'ngx-image-compress/lib/models/data-url';

@Component({
  selector: 'ui-upload-image',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    UiProgressBarComponent,
    NgStyle,
    NgTemplateOutlet,
    ReactiveFormsModule
  ],
  templateUrl: './ui-upload-image.component.html',
  styleUrl: './ui-upload-image.component.scss'
})
export class UiUploadImageComponent implements OnInit, OnChanges, OnDestroy {

  protected readonly UploadImageStates = UploadImageStates;

  state = signal<UploadImageStates>(UploadImageStates.Rest);

  uploadedImage = model<File>(null);

  showPreview = signal<boolean>(false);

  previewImageSrc = signal<string>(null);

  maxImageSizeInKB = input<number>(1000);
  fileType = input<string>(null, {alias: 'file-type'});

  supportedImageTypes = input.required<string>();

  imageTitle = input<string>();

  mandatory = input<BehaviorSubject<boolean>>();

  hasUploadError = input<BehaviorSubject<boolean>>();

  isPdfMode = computed(() => this.fileType() === 'pdf' || this.fileType() === 'application/pdf');

  @Output() deleteImage = new EventEmitter<boolean>();

  @Output() uploadNewImage = new EventEmitter();

  @Output() cancelUpload = new EventEmitter();

  messages: { [key: number]: string };
  previewPdf = signal<SafeUrl>('');
  fileName = signal<string>('');
  currentMessage = signal<UploadMessageTypesEnum>(UploadMessageTypesEnum.Warning);

  inputForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    public sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
  ) {
    this.inputForm = new FormGroup({
      fileInput: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.uploadedImage) {
      if (changes?.uploadedImage?.currentValue) {
        this.state.set(UploadImageStates.Uploaded);
        this.createImageBase64();
      } else {
        this.inputForm?.patchValue({
          fileInput: ''
        });
        if (this.state() === UploadImageStates.Uploaded ||
          this.state() === UploadImageStates.Uploading) {
          this.state.set(UploadImageStates.Rest);
        }
      }
    }
  }

  initialize(): void {
    this.initializeMessages();

    if (this.uploadedImage()) {
      this.state.set(UploadImageStates.Uploaded);
      this.createImageBase64();
    }

    this.subscriptions.push(this.mandatory().subscribe({
      next: value => {
        if (value) {
          this.showMustEnter();
        }
      }
    }));

    this.subscriptions.push(this.hasUploadError().subscribe({
      next: value => {
        if (value) {
          this.uploadFailed();
        }
      }
    }));
  }

  initializeMessages(): void {
    this.messages = {
      [UploadMessageTypesEnum.FileSize]: `حجم فایل آپلود شده بیش از حد مجاز است.`,
      [UploadMessageTypesEnum.FileFormat]: 'شما می‌توانید تنها فرمت تصویر(عکس)  را بارگذاری کنید.',
      [UploadMessageTypesEnum.Mandatory]: 'تصویر مورد نظر را بارگذاری کنید.',
      [UploadMessageTypesEnum.Warning]: ''
    };
  }

  fileSelected($event: any): void {
    if (!$event.target.files[0]) {
      return;
    }

    this.subscriptions.push(this.preprocessFile($event.target.files[0]).subscribe({
      next: enteredFile => {
        if (enteredFile.size > this.maxImageSizeInKB() * 1000) {
          this.state.set(UploadImageStates.Error);
          this.currentMessage.set(UploadMessageTypesEnum.FileSize);

          if (this.uploadedImage()) {
            this.deleteImage.emit(true);
          }

          return;
        }

        this.state.set(UploadImageStates.Uploading);

        this.currentMessage.set(UploadMessageTypesEnum.Warning);

        this.uploadNewImage.emit(enteredFile);

      }
    }));
  }

  preprocessFile(file: File): Observable<File> {
    const fileType: string = file.type.split('/')[1];
    this.isPdfMode = computed(() => fileType === 'pdf' || fileType === 'application/pdf');
    return new Observable((observer) => {
      new Promise((resolve) => {
        if (['heic', 'heif'].includes(fileType)) {
          heic2any({blob: file, toType: 'image/jpeg'})
            .then((blob: Blob) => {
              resolve(new File([blob], file.name.split('.')[0] + '.jpeg', {type: blob.type}));
            });
        } else {
          resolve(file);
        }
      }).then((convertedFile: File) => {
        if (!this.isFileTypeSupported(fileType)) {
          this.state.set(UploadImageStates.Error);
          this.currentMessage.set(UploadMessageTypesEnum.FileFormat);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl: string = event.target.result as string;
          if (this.isPdfMode()) {
            observer.next(this.dataURLToFile(dataUrl, file.name.split('.')[0] + '.pdf'));
          } else {
            this.compressImage(dataUrl, file.name).then(file => observer.next(file));
          }
          this.fileName.set(file.name);
        };
        reader.readAsDataURL(convertedFile);
      });

    });
  }

  compressImage(dataUrl: DataUrl, fileName: string): Promise<File> {
    return new Promise(resolve => {
      this.imageCompress.compressFile(dataUrl, DOC_ORIENTATION.Default, 70).then(compressedImage => {
        const file = this.dataURLToFile(compressedImage, fileName);
        if (file.size > this.maxImageSizeInKB() * 1000 && file.size < 30000000) {
          resolve(this.compressImage(compressedImage, fileName));
        }
        resolve(new Promise(resolve => resolve(file)));
      });
    });
  }

  dataURLToFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, {type: mime});
  }

  isFileTypeSupported(fileType: string): boolean {
    return this.supportedImageTypes()?.includes(fileType);
  }

  createImageBase64(): void {
    if (this.uploadedImage()) {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (this.isPdfMode()) {
            this.previewPdf.update(() =>
              this.sanitizer.bypassSecurityTrustResourceUrl((reader.result as string).replace('octet-stream', 'pdf')));
            this.previewImageSrc.set(null);
          } else {
            this.previewImageSrc.set(reader.result);
          }
        }
      };

      reader.readAsDataURL(this.uploadedImage());
    }
  }

  previewSelected(): void {
    this.showPreview.set(true);
  }

  showMustEnter(): void {
    this.state.set(UploadImageStates.Error);
    this.currentMessage.set(UploadMessageTypesEnum.Mandatory);
  }

  uploadFailed(): void {
    this.state.set(UploadImageStates.Error);
    this.currentMessage.set(UploadMessageTypesEnum.Mandatory);
  }

  closePreviewImage(): void {
    this.showPreview.set(false);
  }

  closeBtnClicked(): void {
    switch (this.state()) {
      case UploadImageStates.Uploaded: {
        this.deleteImage.emit();
        break;
      }
      case UploadImageStates.Uploading: {
        this.state.set(UploadImageStates.Uploaded);
        this.cancelUpload.emit();
        break;
      }
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
