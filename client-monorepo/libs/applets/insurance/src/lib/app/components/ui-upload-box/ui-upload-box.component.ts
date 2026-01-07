import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CircleProgressBarComponent } from '../circle-progress-bar/circle-progress-bar.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type uploadBoxType = 'initial' | 'uploading' | 'success' | 'failed';

@Component({
  selector: 'ui-upload-box',
  templateUrl: './ui-upload-box.component.html',
  styleUrls: ['./ui-upload-box.component.scss'],
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, CircleProgressBarComponent]
})
export class UiUploadBoxComponent implements OnInit {

  @Input()
  uploadType: uploadBoxType;

  @Input()
  percent = 0;

  @Output()
  selectedFile = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  fileSelected(fileObject): void {
    this.selectedFile.emit(fileObject.target.files[0]);
  }
}
