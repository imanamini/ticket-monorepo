import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CacheService } from '../../services/cache.service';
import { CreditHttpService } from '../../../api/credit-http.service';

@Component({
  selector: 'digipay-image',
  templateUrl: './digipay-image.component.html',
  styleUrls: ['./digipay-image.component.scss']
})
export class DigipayImageComponent implements OnInit, OnChanges {

  @Input()
  imageId: string;

  @Input()
  width: string;

  @Input()
  height: string;

  @Input()
  centered: string;

  @Input()
  styles: object = {};

  imageLoaded = false;

  image: SafeResourceUrl;

  @Output()
  loadError = new EventEmitter<any>();

  constructor(
    private sanitizer: DomSanitizer,
    private cache: CacheService,
    private apiService: CreditHttpService,
  ) {
  }

  ngOnInit() {
    this.getImageData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageId && changes.imageId.currentValue !== changes.imageId.previousValue) {
      this.getImageData();
    }
  }

  private getImageData() {
    if (this.imageId) {
      const cacheKey = 'image_' + this.imageId;
      if (!this.cache.has(cacheKey)) {
        this.apiService.getImage(this.imageId).subscribe(data => {
          this.imageLoaded = true;
          const blob = new Blob([<Blob> data], {type: 'application/octet-stream'});
          this.image = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

          this.cache.put(cacheKey, this.image);
        }, e => {
          this.loadError.emit(e);
        });
      } else {
        this.image = this.cache.get(cacheKey);
        this.imageLoaded = true;
      }
    }
  }

  getImageStyles() {
    let styles = Object.assign({}, this.styles);

    if (this.width) {
      styles['width'] = this.width;
    }
    if (this.height) {
      styles['height'] = this.height;
    }

    if (this.centered) {
      styles['margin-left'] = 'auto';
      styles['margin-right'] = 'auto';
      styles['display'] = 'block';
    }

    return styles;
  }

}
