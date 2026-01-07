import { Directive, effect, ElementRef, inject, input, OnInit } from '@angular/core';
import { ApplicationFormService } from '../../services/application-form.service';
import { LazyLoadImageServices } from './lazy-load-image.services';

@Directive({
  selector: '[lazy-load-image]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit {
  private applicationService = inject(ApplicationFormService);
  private el = inject(ElementRef);
  private lazyLoadImageServices = inject(LazyLoadImageServices);
  imageId = input.required<string>({alias: 'lazy-load-image'});
  setImageToSrc = input<boolean>(true, {alias: 'set-image-to-src'});
  applicationFormId = input.required<string>({alias: 'application-form-id'});

  constructor() {
    effect(() => {
      if (this.imageId() && this.setImageToSrc()) {
        this.loadImage();
      }
    });
  }

  ngOnInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (this.imageId()) {
            this.loadImage();
          }
          observer.unobserve(this.el.nativeElement);
        }
      });
    });

    observer.observe(this.el.nativeElement);
  }

  private loadImage(): void {
    if (this.lazyLoadImageServices.has(this.imageId())) {
      this.setImageToElement(this.lazyLoadImageServices.get(this.imageId()));
      return;
    }
    this.applicationService.getImageFile(this.applicationFormId(), this.imageId()).subscribe(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        this.lazyLoadImageServices.set(this.imageId(), url);
        this.setImageToElement(url);
      }
    });
  }

  private setImageToElement(url: string): void {
    if (this.setImageToSrc()) {
      this.el.nativeElement.src = url;
    } else {
      this.el.nativeElement.style.backgroundImage = `url(${url})`;
    }
  }
}
