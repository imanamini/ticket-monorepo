import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[onErrorSrc]',
  standalone: true
})
export class OnErrorSrcDirective {
  @Input() onErrorSrc!: string;

  @HostListener('error', ['$event'])
  onError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.onErrorSrc; // Set fallback image
  }
}
