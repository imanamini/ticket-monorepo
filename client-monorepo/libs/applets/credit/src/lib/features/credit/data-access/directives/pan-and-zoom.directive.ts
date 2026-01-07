import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[panZoom]',
})
export class PanZoomDirective implements OnInit {
  private scale = 1;
  private currentX = 0;
  private currentY = 0;

  private lastX = 0;
  private lastY = 0;

  private initialDistanceForZoom = 0;
  private initialScaleForZoom = 1;

  private element: HTMLElement;
  private tapped: any = null;

  private minScale = 1;
  private maxScale = 2;

  constructor(private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    this.setupInitialStyles();
  }

  private setupInitialStyles() {
    this.element.style.touchAction = 'none';
    this.element.style.userSelect = 'none';
    this.element.style.transformOrigin = '0 0';
    this.element.style.transition = 'transform 0.1s linear';
    this.updateTransform();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      this.initialDistanceForZoom = this.getDistance(event.touches[0], event.touches[1]);
      this.initialScaleForZoom = this.scale;
    } else if (event.touches.length === 1) {
      if (!this.tapped) {
        this.tapped = setTimeout(() => {
          this.tapped = null;
        }, 300);
        this.lastX = event.touches[0].clientX;
        this.lastY = event.touches[0].clientY;
      } else {
        clearTimeout(this.tapped);
        this.tapped = null;
        this.reset();
      }
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    const oldScale = this.scale;

    if (event.touches.length === 2 && this.initialDistanceForZoom > 0) {
      const currentDistance = this.getDistance(event.touches[0], event.touches[1]);
      const scaleRatio = currentDistance / this.initialDistanceForZoom;
      const newScale = Math.min(Math.max(this.initialScaleForZoom * scaleRatio, this.minScale), this.maxScale);

      const pinchClientX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      const pinchClientY = (event.touches[0].clientY + event.touches[1].clientY) / 2;

      const rect = this.element.getBoundingClientRect();
      const offsetX = pinchClientX - rect.left;
      const offsetY = pinchClientY - rect.top;

      const dx = offsetX / this.scale;
      const dy = offsetY / this.scale;

      this.currentX -= dx * (newScale - oldScale);
      this.currentY -= dy * (newScale - oldScale);

      this.scale = newScale;
    } else if (event.touches.length === 1) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.lastX;
      const deltaY = touch.clientY - this.lastY;

      this.currentX += deltaX;
      this.currentY += deltaY;

      this.lastX = touch.clientX;
      this.lastY = touch.clientY;
    }

    this.applyBounds();
    this.updateTransform();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (event.touches.length < 2) {
      this.initialDistanceForZoom = 0;
    }
    if (event.touches.length < 1) {
      this.lastX = 0;
      this.lastY = 0;
    }
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent) {
    event.preventDefault();
    this.reset();
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private applyBounds() {
    const container = this.element;
    const containerWidth = container?.clientWidth || window.innerWidth;
    const containerHeight = container?.clientHeight || window.innerHeight;

    const elementWidth = this.element.clientWidth * this.scale;
    const elementHeight = this.element.clientHeight * this.scale;

    const minX = Math.min(0, containerWidth - elementWidth);
    const maxX = containerWidth / 1.6;

    const minY = Math.min(0, containerHeight - elementHeight);
    const maxY = 0;

    this.currentX = Math.max(minX, Math.min(this.currentX, maxX));
    this.currentY = Math.max(minY, Math.min(this.currentY, maxY));
  }

  private updateTransform() {
    this.element.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.scale})`;
  }

  private reset() {
    this.element.style.transition = 'transform 0.3s ease-out';
    this.scale = this.minScale;
    this.currentX = 0;
    this.currentY = 0;
    this.updateTransform();

    setTimeout(() => {
      this.element.style.transition = 'transform 0.1s linear';
    }, 300);
  }
}
