import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef, EventEmitter,
  Input, OnChanges,
  OnInit, Output,
  QueryList, SimpleChanges,
  ViewChild
} from '@angular/core';
import { HorizontalSwipeItemDirective } from './horizontal-swipe-item.directive';

@Component({
  selector: 'ui-horizontal-swiper',
  templateUrl: './horizontal-swiper.component.html',
  styleUrls: ['./horizontal-swiper.component.scss']
})
export class HorizontalSwiperComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges {

  @ViewChild('scroll')
  scroll: ElementRef<HTMLDivElement>;

  @Input()
  length;

  active = 0;

  @ContentChildren(HorizontalSwipeItemDirective)
  items !: QueryList<HorizontalSwipeItemDirective>;

  @Output()
  swiped = new EventEmitter<number>();

  @Input()
  showDots = true;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialize(true);

      this.items.changes.subscribe(() => {
        setTimeout(() => {
          this.initialize(false);
        });
      });
    });
  }

  ngAfterContentInit(): void {

  }

  private initialize(firstTime: boolean) {
    this.active = 0;

    for (let x = 0; x < this.length; x++) {
      const el = this.getItemElement(x);
      el.classList.remove('next', 'prev', 'active');
    }

    const s = this.getSiblings(this.active);
    const active = this.getItemElement(s.current);
    const next = this.getItemElement(s.next);
    const prev = this.getItemElement(s.prev);

    if (next) {
      next.classList.remove('prev', 'active');
      next.classList.add('next');
    }
    if (prev) {
      prev.classList.remove('active', 'next');
      prev.classList.add('prev');
    }

    active.classList.remove('prev', 'next');
    active.classList.add('active');

    if (firstTime) {
      this.subscribeToSubjects();
    }
  }

  private subscribeToSubjects() {
    // TODO: re-implement usages of home service
    /*this.homeService.vScrollTo.asObservable().subscribe(scrollIndexes => {
      this.active = scrollIndexes[0];
      this.initialize(false);
    });*/
  }

  swipe($event) {
    const x = Math.abs($event.deltaX) > 40 ? ($event.deltaX > 0 ? 'right' : 'left') : '';

    switch (x) {
      case 'left':
        this.handleSwipeLeft();
        break;
      case 'right':
        this.handleSwipeRight();
        break;
    }
  }

  private emitSwipe() {
    // TODO: re-implement usages of home service
    // this.homeService.storeDefaultScrollIndexes(this.active, 0);
    this.swiped.emit(this.active);
  }

  private handleSwipeLeft() {
    let activeIndex = this.active;
    if (activeIndex - 1 >= 0) {
      activeIndex -= 1;
    } else {
      activeIndex = this.length - 1;
    }

    const s = this.getSiblings(this.active);

    const current = this.getItemElement(this.active);

    current.classList.remove('active');
    current.classList.add('next');

    const newActive = this.getItemElement(s.prev);
    newActive.classList.remove('prev');
    newActive.classList.add('active');

    const next = this.getItemElement(s.next);
    next.classList.remove('next');

    const s2 = this.getSiblings(activeIndex);
    const prev = this.getItemElement(s2.prev);
    prev.classList.add('prev', 'moving');

    setTimeout(() => {
      prev.classList.remove('moving');
    }, 200);

    this.active = activeIndex;
    this.emitSwipe();
  }

  private handleSwipeRight() {
    let activeIndex = this.active;
    if (activeIndex + 1 <= this.length - 1) {
      activeIndex += 1;
    } else {
      activeIndex = 0;
    }

    const s = this.getSiblings(this.active);

    const current = this.getItemElement(this.active);
    current.classList.remove('active');
    current.classList.add('prev');

    const newActive = this.getItemElement(s.next);
    newActive.classList.remove('next');
    newActive.classList.add('active');

    const prev = this.getItemElement(s.prev);
    prev.classList.remove('prev');

    const s2 = this.getSiblings(activeIndex);

    const next = this.getItemElement(s2.next);

    next.classList.add('moving', 'next');

    setTimeout(() => {
      next.classList.remove('moving');
    }, 200);

    this.active = activeIndex;
    this.emitSwipe();
  }

  private getItemElement(index: number): any {
    return this.scroll.nativeElement.children.item(index);
  }

  private getSiblings(ci) {
    let prev = ci - 1;
    let next = ci + 1;
    if (prev < 0) {
      if (this.length >= 2) {
        prev = this.length - 1;
      }
    }
    if (next > this.length - 1) {
      next = 0;
    }

    return {
      prev,
      next,
      current: ci,
    };
  }

}
