import { Component, output } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-bnpl-landing-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './bnpl-landing-header.component.html',
  styleUrl: './bnpl-landing-header.component.scss'
})
export class BnplLandingHeaderComponent {

  close = output();

}
