import { ChangeDetectorRef, Component, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ExtractIMEIService } from './extract-imei.service';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { IFileUpload, NgxUploaderComponent } from '@digipay/ngx-uploader';
import { ImeiPattern } from '../../../../../../util/patterns';

@Component({
  selector: 'extract-imei',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxUploaderComponent
  ],
  templateUrl: './extract-imei.component.html',
  styleUrl: './extract-imei.component.scss'
})
export class ExtractIMEIComponent implements OnInit {
  public imeIValue = output<string>({alias: 'set-imei'});
  public imeiFormControl = new FormControl({
    value: null,
    disabled: true
  }, {
    validators: [
      Validators.required,
      Validators.pattern(ImeiPattern)
    ],
    updateOn: 'change'
  });
  public showImeiInput = signal<boolean>(false);
  public previewScreenshot = signal<string>(null);
  serialNumber = input<string>('');
  private snackBarService = inject(SnackbarService);
  private extractImeiService = inject(ExtractIMEIService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      if (this.serialNumber()) {
        this.showSerialNumberInEditMode();
      }
    });
  }

  ngOnInit(): void {
    this.setValueToFormControl();
  }

  showSerialNumberInEditMode(): void {
    this.imeiFormControl.setValue(this.serialNumber());
    this.imeIValue.emit(this.serialNumber());
  }

  async onFileUpload(file: IFileUpload): Promise<void> {
    this.imeiFormControl.setValue(null);
    this.imeiFormControl.disable();
    this.previewScreenshot.set(null);
    file.state = 'uploading';
    try {
      if (file.file) {
        const imei = await this.extractImeiService.processImage(file.file);
        this.showImeiInput.set(true);
        if (imei) {
          this.imeiFormControl.setValue(imei);
          this.imeIValue.emit(imei);
          this.snackBarService.openSnackBar({
            message: 'IMEI با اسکرین‌شات تشخیص داده شد.',
            status: 'success',
            duration: 3000
          });
          this.convertFileToBase64(file.file);
          this.imeiFormControl.disable();
          file.state = 'uploaded';
        } else {
          this.showImeiError(file);
        }
      }
    } catch {
      this.showImeiError(file);
    }
  }

  private setValueToFormControl(): void {
    this.imeiFormControl.valueChanges.subscribe(value => this.imeIValue.emit(value));
  }

  private showImeiError(file: IFileUpload): void {
    this.showImeiInput.set(true);
    this.imeiFormControl.setValue(null);
    this.imeiFormControl.enable();
    this.snackBarService.openSnackBar({
      message: 'IMEI با اسکرین‌شات تشخیص داده نشد.',
      description: 'شماره سریال را به صورت دستی وارد کنید.',
      status: 'error',
      duration: 5000
    });
    file.state = 'error';
    this.imeIValue.emit(null);
    this.cdr.detectChanges();
  }

  private convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewScreenshot.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
