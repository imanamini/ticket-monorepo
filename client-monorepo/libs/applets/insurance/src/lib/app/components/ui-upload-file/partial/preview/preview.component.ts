import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgClass, NgOptimizedImage, NgStyle } from '@angular/common';

@Component({
  selector: 'preview',
  standalone: true,
  imports: [
    NgStyle,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {

  srcUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: {
    srcUrl?: string,
  }) {
    this.srcUrl = dialogData.srcUrl;
  }
}
