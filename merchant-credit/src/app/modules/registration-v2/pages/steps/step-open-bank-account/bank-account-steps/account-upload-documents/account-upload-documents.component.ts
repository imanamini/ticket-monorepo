import { Component, Input, OnInit } from '@angular/core';
import { StepBase } from '../../../step-base';
import { RegistrationService } from '../../../../../registration.service';
import { UploadableFile } from '../../../../../../../api/models/upload/uploadable-file';
import { MessageService } from '../../../../../../../core/message.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'account-upload-documents',
  templateUrl: './account-upload-documents.component.html',
  styleUrls: ['./account-upload-documents.component.scss']
})
export class AccountUploadDocumentsComponent extends StepBase implements OnInit {

  @Input() files: UploadableFile[] = [];

  uploadErrors: { [id: string]: string } = {};

  filesStates: { [id: string]: 'UPLOADING' | 'UPLOADED' | 'ERROR' } = {};

  uploadedFilesCount = 0;

  constructor(
    private service: RegistrationService,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  onFilePick(id: string, file: File): void {
    if (this.filesStates[id] === 'UPLOADING') {
      return;
    }
    this.filesStates[id] = 'UPLOADING';
    this.service.uploadDocument(id, file).pipe(
      switchMap(res => {
        this.filesStates[id] = 'UPLOADED';
        this.calcCountOfUploadedFiles();
        if (res.result.status === 0) {
          this.uploadErrors[id] = '';
        }
        return of(null);
      }),
      catchError(e => {
        this.filesStates[id] = 'ERROR';
        this.uploadErrors[id] = this.messageService.getMessageIfHasAny(e, 'خطا. لطفا مجددا تلاش کنید');
        return of(null);
      })
    ).subscribe();
  }

  private calcCountOfUploadedFiles() {
    let count = 0;
    Object.keys(this.filesStates).forEach(key => {
      if (this.filesStates[key] === 'UPLOADED') {
        count += 1;
      }
    });
    this.uploadedFilesCount = count;
  }

  proceedToNextStep() {
    if (this.files.length > this.uploadedFilesCount) {
      return;
    }

    this.service.approveDocuments().pipe(
      switchMap(res => {
        this.nextStep.emit();
        return of(null);
      }),
      catchError(e => {
        this.messageService.showErrorIfExists(e);
        return of(null);
      })
    ).subscribe();

  }

}
