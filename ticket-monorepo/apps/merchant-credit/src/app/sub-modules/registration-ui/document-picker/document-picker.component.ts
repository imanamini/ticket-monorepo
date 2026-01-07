import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'document-picker',
  templateUrl: './document-picker.component.html',
  styleUrls: ['./document-picker.component.scss']
})
export class DocumentPickerComponent implements OnInit {

  @ViewChild('fileInput', {
    static: false
  })
  fileInput!: ElementRef<HTMLInputElement>;

  @Output()
  fileChanged = new EventEmitter<File>();

  @Input()
  docTitle!: string;

  @Input()
  description!: string;

  @Input()
  iconImageId!: string;

  @Input()
  uploadState: 'UPLOADING' | 'UPLOADED' | 'ERROR' | '' = '';

  @Input()
  errorMessage = '';

  @Input()
  allowChange = true;

  selectedFile!: File;

  fileUrl: SafeUrl | null | string = null;

  maxSize = 2097152;



  constructor(
    private sanitizer: DomSanitizer,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
  }

  ngOnInit(): void {
  }

  pickFile(): void {
    if (this.allowChange && this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFilePick(): void {
    const files = this.fileInput.nativeElement.files;
    if (!files) {
      return;
    }
    const file = files.item(0);
    if (file) {
      this.ng2ImgMax.resizeImage(file, 1000, 1500).subscribe(
        result => {
          // convert Blob to File Object
          const myFile = this.blobToFile(result, result.name);
          //check if the file is still large after resizeImage
          if (myFile.size > this.maxSize) {
            this.compressImage(myFile, this.maxSize);
          } else {
            this.selectedFile = myFile;
            this.readFile(myFile);
            this.fileInput.nativeElement.value = '';
            this.fileChanged.emit(myFile);
          }
        },
        error => {
          if(error.error === 'INVALID_EXTENSION')
          this.errorMessage = 'نوع فایل نامعتبر است'
        }
      );

    }
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File(
      [theBlob as any], // cast as any
      fileName,
      {
        lastModified: new Date().getTime(),
        type: theBlob.type
      }
    );
  };

  compressImage(file: File, maxSizeInMB: number) {
    this.ng2ImgMax.compressImage(file, maxSizeInMB)
      .subscribe(compressedImage => {
        // Do whatever you want to do with the compressed file, like send to server.
        this.selectedFile = compressedImage;
        this.readFile(compressedImage);
        this.fileInput.nativeElement.value = '';
        this.fileChanged.emit(compressedImage);
      }, error => {
        console.log('compress error', error.reason);
      });
  }

  private readFile(file: File) {
    // const url = URL.createObjectURL(file);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.fileUrl = fileReader.result;
    };
    fileReader.readAsDataURL(file);
    // this.fileUrl = this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
