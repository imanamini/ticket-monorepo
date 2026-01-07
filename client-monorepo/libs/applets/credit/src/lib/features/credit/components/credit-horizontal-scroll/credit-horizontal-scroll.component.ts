import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'credit-horizontal-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-horizontal-scroll.component.html',
  styleUrl: './credit-horizontal-scroll.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditHorizontalScrollComponent implements OnInit, AfterViewInit {
  classes = input<string>('');
  scrollContainer = viewChild<ElementRef>('scrollContainer');
  uniqueId = signal<string>('');
  zone = inject(NgZone);
  ngOnInit() {
    this.uniqueId.set('swiper-' + Math.floor(Math.random() * 10000));
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      swiper(document.getElementById(this.uniqueId()) as HTMLElement);
    });
  }
}

function swiper(ele: HTMLElement) {
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  let grabbing = false;

  const mouseDownHandler = function (e: MouseEvent) {
    pos = {
      // The current scroll
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    e.preventDefault();
    e.stopPropagation();
  };

  const mouseMoveHandler = function (e: MouseEvent) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
    if (Math.abs(dx) > 5) {
      grabbing = true;
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const mouseUpHandler = function (event: MouseEvent) {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => {
      grabbing = false;
    });
  };

  const mouseClick = function (event: MouseEvent) {
    if (grabbing) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
  };

  if (ele) {
    ele.addEventListener('mousedown', mouseDownHandler, true);
    ele.addEventListener('click', mouseClick, true);
  }
}
