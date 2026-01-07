import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Tab } from '../../../api/clients/registration-v3/basic-models/branch-info.model';

function swiper(ele: any) {
  let pos = {top: 0, left: 0, x: 0, y: 0};
  const mouseDownHandler = function (e: any) {
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

  const mouseMoveHandler = function (e: any) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const onTouchMove = function (event: TouchEvent) {
    const dx = event.touches[0].clientX - pos.x;
    const dy = event.touches[0].clientY - pos.y;
    ele.scrollTo(ele.scrollLeft - dx, ele.scrollTop - dy);
  };
  const mouseUpHandler = function () {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  if (ele) {
    ele.addEventListener('mousedown', mouseDownHandler);
    ele.addEventListener('touchmove', onTouchMove);
  }
}

@Component({
  selector: 'ui-status-tabs',
  templateUrl: './ui-status-tabs.component.html',
  styleUrls: ['./ui-status-tabs.component.scss']
})

export class UiStatusTabsComponent implements OnInit, AfterViewInit {

  @Input() tabs: Tab[] = [];
  @Output() toggleClicked = new EventEmitter<any>();

  currentOption: number = 0;
  uniqueId: string = '';

  constructor(private zone: NgZone) {
  }

  ngOnInit(): void {
    this.uniqueId = 'swiper-' + Math.floor(Math.random() * 10000);
  }

  toggleTabs(option: any): void {
    this.currentOption = option;
    this.toggleClicked.emit(option);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      swiper(document.getElementById(this.uniqueId));
    });
  }

}
