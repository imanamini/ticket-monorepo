import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../../core/models/storage-schema';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-comment-form',
  templateUrl: './ui-comment-form.component.html',
  styleUrls: ['./ui-comment-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, UiButtonComponent],
})
export class UiCommentFormComponent implements OnInit, OnChanges {
  form: UntypedFormGroup;

  @Input()
  inReplyToAuthor!: string;

  @Input()
  errorMessages: string[] = [];

  @Output()
  cancelReply = new EventEmitter();

  @Output()
  formSubmission = new EventEmitter();

  @Input()
  successMessage = '';

  @Input()
  clearSignal = 0;

  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.form = this.formBuilder.group({
      commentText: ['', [Validators.required]],
      email: ['', [Validators.required]],
      author: ['', [Validators.required]],
      rememberMe: [true],
    });
  }

  ngOnInit(): void {
    const storageData = this.storage.getAll();
    if (storageData.userInfo) {
      this.form.patchValue({
        email: storageData.userInfo.email,
        author: storageData.userInfo.name,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSignal'] && changes['clearSignal'].currentValue) {
      this.form.patchValue({
        commentText: '',
      });
    }
  }

  sendComment() {
    this.formSubmission.emit(this.form.value);
  }

  onCancelReply() {
    this.cancelReply.emit();
  }
}
