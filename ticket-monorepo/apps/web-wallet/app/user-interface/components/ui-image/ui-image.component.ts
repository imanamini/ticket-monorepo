import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../../core/http/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-image',
  templateUrl: './ui-image.component.html',
  styleUrls: ['./ui-image.component.scss']
})
export class UiImageComponent implements OnInit, OnChanges {

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

  imageLoaded: boolean = false;

  image: SafeResourceUrl;

  @Output()
  loadError = new EventEmitter<any>();

  @Input()
  apiEndpoint: 'FILE_SERVER' = 'FILE_SERVER';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.getImageData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageId'] && changes['imageId'].currentValue !== changes['imageId'].previousValue) {
      this.getImageData();
    }
  }

  private getImageData() {
    const ticket = this.activatedRoute.snapshot.params['ticket'] || sessionStorage.getItem('ticket');
    let method = this.apiService.getImage.bind(this.apiService);

    method(this.imageId , ticket).subscribe(data => {
      this.imageLoaded = true;
      const blob = new Blob([<Blob> data], {type: 'application/octet-stream'});
      this.image = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }, e => {
      this.loadError.emit(e);
    });
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
