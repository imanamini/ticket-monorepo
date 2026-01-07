import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ui-pdf-viewer',
  templateUrl: './ui-pdf-viewer.component.html',
  styleUrls: ['./ui-pdf-viewer.component.scss']
})
export class UiPdfViewerComponent implements OnInit {

  page = 1;

  totalPage: number = 0;

  @Input()
  pdfFile!: any; // buffer

  @Output()
  back = new EventEmitter<void>();

  @Output()
  finish = new EventEmitter<void>();

  @Output()
  downloadDoc = new EventEmitter<any>();

  loadedDoc!: string;

  fullscreen = false;

  @ViewChild('docPreview')
  docPreview!: ElementRef<HTMLDivElement>;

  zoom = 100;

  zoomStep = 20;

  maxZoom = 200;

  minZoom = 100;

  constructor() {
  }

  ngOnInit(): void {
  }

  goToFullScreen() {
    const elem: any = this.docPreview.nativeElement;
    if (!this.isFullScreen()) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    } else {
      const d: any = document;
      if (d.exitFullscreen) {
        d.exitFullscreen();
      } else if (d.webkitExitFullscreen) { /* Safari */
        d.webkitExitFullscreen();
      } else if (d.msExitFullscreen) { /* IE11 */
        d.msExitFullscreen();
      }
    }
  }

  onFullscreenChange() {
    this.fullscreen = this.isFullScreen();
    this.zoom = 100;
  }

  isFullScreen(): boolean {
    const d: any = document;
    return !(!d.fullscreenElement && !d.webkitIsFullScreen && !d.mozFullScreen && !d.msFullscreenElement);
  }

  zoomIn(): void {
    if (this.zoom + this.zoomStep <= this.maxZoom) {
      this.zoom += this.zoomStep;
    }
  }

  zoomOut() {
    if (this.zoom - this.zoomStep >= this.minZoom) {
      this.zoom -= this.zoomStep;
    }
  }

  download() {
    this.downloadDoc.emit();
  }

  onPage($event: any) {
    if ($event && $event.source && $event.source._pages && $event.source._pages.length) {
      this.totalPage = $event.source._pages.length;
    }
  }

}
