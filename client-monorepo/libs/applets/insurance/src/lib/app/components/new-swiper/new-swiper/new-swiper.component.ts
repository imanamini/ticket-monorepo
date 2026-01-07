import { AfterViewInit, Component, ContentChildren, NgZone, OnInit, QueryList } from '@angular/core';
import { ListDirective } from '../directive/list.directive';
import { NgFor, NgTemplateOutlet } from '@angular/common';

function swiper(ele): void {
  let pos = {top: 0, left: 0, x: 0, y: 0};

  const mouseDownHandler = (e) => {
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

  const mouseMoveHandler = (e) => {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = () => {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  ele.addEventListener('mousedown', mouseDownHandler);
}

@Component({
  selector: 'new-swiper',
  templateUrl: './new-swiper.component.html',
  styleUrls: ['./new-swiper.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet]
})
export class NewSwiperComponent implements OnInit, AfterViewInit {

  @ContentChildren(ListDirective)
  list !: QueryList<ListDirective>;

  uniqueId: string;

  constructor(private zone: NgZone) {
  }

  ngOnInit(): void {
    this.uniqueId = 'swiper-' + Math.floor(Math.random() * 10000);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      swiper(document.getElementById(this.uniqueId));
    });
  }

}
