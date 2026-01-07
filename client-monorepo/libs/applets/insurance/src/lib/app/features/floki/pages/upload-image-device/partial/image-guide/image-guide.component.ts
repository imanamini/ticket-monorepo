import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'image-guide',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './image-guide.component.html',
  styleUrl: './image-guide.component.scss'
})
export class ImageGuideComponent {
  label = input.required<string>();
  imageAddress = input.required<string>();
}
