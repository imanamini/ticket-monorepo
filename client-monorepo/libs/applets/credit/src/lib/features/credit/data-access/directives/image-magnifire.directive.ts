import { DestroyRef, Directive, effect, ElementRef, HostListener, input, model, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[magnifier]',
  standalone: true,
})
export class ImageMagnifierDirective implements OnInit {
  magnifierSize = input<number>(200);
  zoom = model<number>(2);
  zoomable = input(false);
  rotation = input<number>(0);

  private lens!: HTMLDivElement;
  private isMoving = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2,
    destroyRef: DestroyRef,
  ) {
    // Reactive visibility update
    effect(() => {
      if (this.lens) {
        const display = this.zoomable() ? 'block' : 'none';
        this.renderer.setStyle(this.lens, 'display', display);
      }
    });

    // Clean up on destroy
    destroyRef.onDestroy(() => {
      if (this.lens && this.lens.parentElement) {
        this.renderer.removeChild(this.lens.parentElement, this.lens);
      }
    });
  }

  ngOnInit() {
    if (this.zoomable()) {
      this.createLens();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.zoomable()) return;

    // Throttle with requestAnimationFrame
    if (!this.isMoving) {
      this.isMoving = true;
      requestAnimationFrame(() => {
        this.moveLens(event);
        this.isMoving = false;
      });
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.zoomable()) return;
    this.renderer.setStyle(this.lens, 'visibility', 'visible');
    this.renderer.setStyle(this.lens, 'z-index', '1');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (!this.zoomable()) return;
    this.renderer.setStyle(this.lens, 'visibility', 'hidden');
    this.renderer.setStyle(this.lens, 'z-index', '-1');
  }

  @HostListener('wheel', ['$event'])
  scroll(event: WheelEvent) {
    if (!this.zoomable()) return;

    event.preventDefault();
    const currentZoom = this.zoom();
    const step = 0.2;
    const maxZoom = 6;
    const minZoom = 1;

    if (event.deltaY < 0 && currentZoom < maxZoom) {
      this.zoom.update(v => Math.min(v + step, maxZoom));
    } else if (event.deltaY > 0 && currentZoom > minZoom) {
      this.zoom.update(v => Math.max(v - step, minZoom));
    }

    this.moveLens(event);
  }

  private createLens() {
    this.lens = this.renderer.createElement('div');

    const styles = {
      position: 'absolute',
      border: '1px solid #d4d4d4',
      width: `${this.magnifierSize()}px`,
      height: `${this.magnifierSize()}px`,
      backgroundRepeat: 'no-repeat',
      pointerEvents: 'none',
      visibility: 'hidden',
      zIndex: '-1',
    };

    for (const [key, value] of Object.entries(styles)) {
      this.renderer.setStyle(this.lens, key, value);
    }

    this.renderer.appendChild(this.el.nativeElement.parentElement, this.lens);
  }

  private moveLens(event: MouseEvent) {
    const image = this.el.nativeElement;
    const rect = image.getBoundingClientRect();

    const posX = event.clientX - rect.left;
    const posY = event.clientY - rect.top;

    const rotation = ((this.rotation() % 360) + 360) % 360;
    const width = rotation % 180 === 0 ? rect.width : rect.height;
    const height = rotation % 180 === 0 ? rect.height : rect.width;

    let rotatedX: number, rotatedY: number;

    switch (rotation) {
      case 90:
        rotatedX = posY;
        rotatedY = height - posX;
        break;
      case 180:
        rotatedX = width - posX;
        rotatedY = height - posY;
        break;
      case 270:
        rotatedX = width - posY;
        rotatedY = posX;
        break;
      default:
        rotatedX = posX;
        rotatedY = posY;
    }

    let lensX = Math.max(0, Math.min(rotatedX - this.magnifierSize() / 2, width - this.magnifierSize()));
    let lensY = Math.max(0, Math.min(rotatedY - this.magnifierSize() / 2, height - this.magnifierSize()));

    const backgroundX = rotatedX * this.zoom() - this.magnifierSize() / 2;
    const backgroundY = rotatedY * this.zoom() - this.magnifierSize() / 2;

    this.renderer.setStyle(this.lens, 'left', `${lensX}px`);
    this.renderer.setStyle(this.lens, 'top', `${lensY}px`);
    this.renderer.setStyle(
      this.lens,
      'background-size',
      `${image.width * this.zoom()}px ${image.height * this.zoom()}px`
    );
    this.renderer.setStyle(
      this.lens,
      'background-position',
      `-${Math.max(backgroundX, 0)}px -${Math.max(backgroundY, 0)}px`
    );
    this.renderer.setStyle(this.lens, 'background-image', `url(${image.src})`);
  }
}
