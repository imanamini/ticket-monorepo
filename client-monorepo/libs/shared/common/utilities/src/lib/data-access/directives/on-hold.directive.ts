import { Directive, HostListener, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[commonUtilitiesAppletOnHold]',
  standalone: true,
})
export class OnHoldDirective implements OnDestroy {
  holdTime = input(400); // Hold time in milliseconds
  onHoldMoveThreshold = input(20); // Threshold to distinguish between click and swipe
  enableVibration = input(true); // Threshold to distinguish between click and swipe
  vibrationDuration = input(40); // Threshold to distinguish between click and swipe
  shouldCloseKeyboard = input(true); // Prevents bottom sheets from appearing under open keyboard when onHold is triggered
  handleOnHold = output<Event | null>();

  private timeoutId: any;
  private isHolding = false;
  private startEvent: Event | null = null;
  private startX = 0; // Track the start position (X)
  private startY = 0; // Track the start position
  private moved = false; // Flag to indicate if the mouse has moved

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  @HostListener('pointerdown', ['$event'])
  onHoldStart(event: MouseEvent | TouchEvent): void {
    if (this.startEvent) {
      return;
    }
    this.isHolding = true;
    this.moved = false; // Reset the moved flag on new interaction
    this.startEvent = event; // Store the start event to use later
    this.clearTimeout();

    // Capture the starting position
    if (event instanceof MouseEvent) {
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }

    this.timeoutId = setTimeout(() => {
      if (this.isHolding && !this.moved) {
        if (this.shouldCloseKeyboard()) {
          this.closeKeyboard();
        }
        if (this.enableVibration() && 'vibrate' in navigator) {
          navigator.vibrate(this.vibrationDuration());
        }
        this.handleOnHold.emit(this.startEvent); // Emit the stored start event
      }
    }, this.holdTime());

    // event.preventDefault(); // Prevent the default behavior
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent | TouchEvent): void {
    if (!this.isHolding) return;
    if (!this.startEvent) {
      this.startEvent = event;
    }
    let deltaX = 0;
    let deltaY = 0;
    if (event instanceof MouseEvent) {
      deltaX = Math.abs(event.clientX - this.startX);
      deltaY = Math.abs(event.clientY - this.startY);
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      deltaX = Math.abs(event.touches[0].clientX - this.startX);
      deltaY = Math.abs(event.touches[0].clientY - this.startY);
    }

    // If the movement exceeds the threshold, consider it as "swipe" or "drag"
    if (deltaX > this.onHoldMoveThreshold() || deltaY > this.onHoldMoveThreshold()) {
      this.moved = true;
    }
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('mouseleave')
  @HostListener('touchcancel')
  onHoldEnd(event?: MouseEvent | TouchEvent): void {
    this.isHolding = false;
    this.clearTimeout();
    this.startEvent = null; // Reset the start event
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private closeKeyboard(): void {
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }
}
