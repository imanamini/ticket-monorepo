import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';

function swiper(ele) {
  let pos = {top: 0, left: 0, x: 0, y: 0};

  const mouseDownHandler = function (e) {
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
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  ele.addEventListener('mousedown', mouseDownHandler);
}

@Component({
  selector: 'horizontal-swiper',
  templateUrl: './ui-horizontal-swiper.component.html',
  styleUrls: ['./ui-horizontal-swiper.component.scss'],
  standalone: true
})
export class UiHorizontalSwiperComponent implements OnInit, AfterViewInit {

  uniqueId: string;

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.uniqueId = 'swiper-' + Math.floor(Math.random() * 10000);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      swiper(document.getElementById(this.uniqueId));
    });
  }

}
