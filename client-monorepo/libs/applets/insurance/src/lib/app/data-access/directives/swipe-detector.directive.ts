import { Directive, ElementRef, HostListener, input, OnDestroy, OnInit, output } from '@angular/core';
import { SwipingEventModel } from '../models/swiping-event.model';
import { SwipePointEventModel } from '../models/swipe-point-event.model';
import { fromEvent, merge, Subscription, switchMap, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[commonUtilitiesSwipeDetector]',
  standalone: true,
})
export class SwipeDetectorDirective implements OnInit, OnDestroy {
  // Inputs
  swipeThreshold = input<number>(50);
  tapThreshold = 20;
  axisToLockOn = input<'X' | 'Y' | 'BOTH'>('BOTH');

  // Outputs
  swipedLeft = output<number>();
  swipedRight = output<number>();
  swipedX = output<number>();
  swipedY = output<number>();
  swipedUp = output<number>();
  swipedDown = output<number>();
  isSwipingVertically = output<boolean>();
  isSwipingHorizontally = output<boolean>();
  swiping = output<SwipingEventModel>();
  swipeStart = output<SwipePointEventModel>();
  swipeEnd = output<SwipePointEventModel>();
  singleTap = output<void>();

  // Variables
  private isSwipeDirectionDetected = false;
  private internalMovingVertically = false;
  private startX = 0;
  private startY = 0;
  private isSwiping = false;
  private subscriptions: Subscription[] = [];
  private swipeTimeOut: any;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.subscribeToPointerEvents();
  }

  subscribeToPointerEvents(): void {
    const hostElement = this.el.nativeElement;

    // Listen to pointerdown, pointerleave, and pointerup in one subscription
    const pointerEvents$ = fromEvent<PointerEvent>(hostElement, 'pointerdown').pipe(
      tap((event) => this.onStart(event.clientX, event.clientY)),
      switchMap(() =>
        merge(
          fromEvent(hostElement, 'pointermove').pipe(
            tap((event: any) => {
              if (this.isSwiping && event.type !== 'touch') {
                this.onMove(event.clientX, event.clientY);
              }
            }),
          ),
          fromEvent<PointerEvent>(hostElement, 'pointerleave').pipe(tap((event) => this.onEnd(event.clientX, event.clientY))),
        ).pipe(takeUntil(fromEvent<PointerEvent>(hostElement, 'pointerup').pipe(tap((event) => this.onEnd(event.clientX, event.clientY))))),
      ),
    );
    const pointerSubscription = pointerEvents$.subscribe();

    this.subscriptions.push(pointerSubscription);
  }

  onStart(clientX: number, clientY: number): void {
    this.isSwiping = true;
    this.startX = clientX;
    this.startY = clientY;
    this.swipeStart.emit({x: this.startX, y: this.startY});
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: any): void {
    if (!this.isSwiping) {
      return;
    }
    const touch = event.changedTouches ? event.changedTouches[0] : event;
    this.onMove(touch.clientX, touch.clientY, event);
  }

  onMove(clientX: number, clientY: number, event?: any): void {
    const deltaX = clientX - this.startX;
    const deltaY = clientY - this.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Detect swipe direction at the start
    if (!this.isSwipeDirectionDetected) {
      if (absDeltaY > absDeltaX) {
        this.isSwipingVertically.emit(true);
        this.internalMovingVertically = true;
        this.isSwipingHorizontally.emit(false);
        this.isSwipeDirectionDetected = true;
      } else if (absDeltaX > absDeltaY) {
        this.isSwipingVertically.emit(false);
        this.internalMovingVertically = false;
        this.isSwipingHorizontally.emit(true);
        this.isSwipeDirectionDetected = true;
      }
    }
    // Auto End the swipe
    if (this.swipeTimeOut) {
      clearTimeout(this.swipeTimeOut);
      this.swipeTimeOut = undefined;
    }
    this.swipeTimeOut = setTimeout(() => {
      this.onEnd(clientX, clientY);
    }, 500);
    this.swiping.emit({
      clientX,
      clientY,
      deltaX,
      deltaY,
    });
    if (event && this.isSwipeDirectionDetected) {
      if (this.axisToLockOn() === 'X' && !this.internalMovingVertically) {
        event.preventDefault();
      } else if (this.axisToLockOn() === 'Y' && this.internalMovingVertically) {
        event.preventDefault();
      } else if (this.axisToLockOn() === 'BOTH') {
        event.preventDefault();
      }
    }
  }

  onEnd(clientX: number, clientY: number): void {
    if (this.swipeTimeOut) {
      clearTimeout(this.swipeTimeOut);
      this.swipeTimeOut = undefined;
    }
    this.isSwiping = false;
    this.isSwipeDirectionDetected = false;
    this.swipeEnd.emit({x: clientX, y: clientY});
    this.isSwipingVertically.emit(false);
    this.isSwipingHorizontally.emit(false);

    const deltaX = clientX - this.startX;
    const deltaY = clientY - this.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX < this.tapThreshold && absDeltaY < this.tapThreshold) {
      this.singleTap.emit();
    } else {
      if (absDeltaX > absDeltaY) {
        this.swipedX.emit(deltaX);
        if (deltaX > 0) {
          this.swipedRight.emit(deltaX);
        } else {
          this.swipedLeft.emit(deltaX);
        }
      } else if (absDeltaY > absDeltaX) {
        this.swipedY.emit(deltaY);
        if (deltaY > 0) {
          this.swipedDown.emit(deltaY);
        } else {
          this.swipedUp.emit(deltaY);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub && sub.unsubscribe());
  }
}
