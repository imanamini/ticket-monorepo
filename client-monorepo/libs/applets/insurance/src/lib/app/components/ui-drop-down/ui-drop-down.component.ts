import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { UiDropDown } from './models/ui-drop-down';
import { NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ui-drop-down',
  templateUrl: './ui-drop-down.component.html',
  styleUrls: ['./ui-drop-down.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle,
    NgTemplateOutlet,
  ],
})
export class UiDropDownComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input()
  dropdownData: UiDropDown;

  @Input()
  withBackdrop = false;

  @Input()
  className;

  @Input()
  constraintElement: HTMLElement;

  @Input()
  visible = false;

  @Input()
  positionMargins: {
    left?: number,
    right?: number,
    top?: number,
  } = {
    left: 20,
    right: 0,
    top: 0,
  };

  @Input()
  hiddenWhileCalculatingPosition: boolean;

  @Output()
  closeDropDown = new EventEmitter();

  @ViewChild('dropDownEl', {
    static: false,
  })
  dropDownEl: ElementRef<HTMLDivElement>;

  constraintRect: ClientRect | DOMRect;

  dropDownRect: ClientRect | DOMRect;

  dropDownPosition = {
    top: 0,
    left: 0,
  };

  dropDownOffThePage = {
    left: 0,
    bottom: 0,
    right: 0,
  };

  initializedPosition = false;

  calculatingPosition: boolean;

  constructor() {
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
    this.windowClick = this.windowClick.bind(this);
  }

  get topArrowStyles() {
    const styles = {
      left: '50%',
      right: '',
    };

    if (this.dropDownOffThePage.right > 0) {
      //  check if arrow left position does not place in the outside of the drop down
      if ((this.dropDownRect.width / 2) + this.dropDownOffThePage.right + 15 < this.dropDownRect.width) {
        styles.left = 'calc(50% + ' + this.dropDownOffThePage.right + 'px';
      } else {
        styles.right = '-15px';
        styles.left = 'auto';
      }

    } else {
      if (this.dropDownOffThePage.left > 0) {
        styles.left = 'calc(50% - ' + this.dropDownOffThePage.left + 'px';
      }
    }

    return styles;
  }

  ngOnInit() {
    window.addEventListener('resize', this.windowResizeCallback);
    window.addEventListener('click', this.windowClick);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.windowResizeCallback);
    window.removeEventListener('click', this.windowClick);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.visible) {
        this.calculateDropDownPosition();
      }
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.visible && changes.visible.currentValue) {
      this.calculatingPosition = true;
      setTimeout(() => {
        if (!this.dropDownEl) {
          setTimeout(() => {
            this.calculateDropDownPosition();
            this.calculatingPosition = false;
          }, 100);
        } else {
          this.calculateDropDownPosition();
          this.calculatingPosition = false;
        }
      }, 100);
    }
  }

  windowClick(e) {
    /* if (this.visible) {
       console.log('OOO');
       if (!this.dropDownEl.nativeElement.contains(e.target)) {
         console.log('BBBBB');
         // outside dropdown
         this.closeDropDown.emit(true);
       }
     }*/
  }

  windowResizeCallback() {
    if (this.dropDownEl) {
      this.calculateDropDownPosition();
    }
  }

  backdropClick($event) {
    this.closeDropDown.emit(true);
  }

  backdropChildClick($event) {
    $event.stopPropagation();
  }

  /*
  * When the component has a parent with `contain: strict` style,
  * the fixed position is relative to that parent,
  * This method resolves this issue
  * */
  doubleCheckPosition() {
    return new Promise((resolve => {
      setTimeout(() => {
        if (!this.dropDownEl || !this.dropDownEl.nativeElement) {
          return resolve(true);
        }
        const dropDownRect = this.dropDownEl.nativeElement.getBoundingClientRect();
        if (dropDownRect.top !== this.dropDownPosition.top) {
          const diff = dropDownRect.top - this.dropDownPosition.top;
          this.dropDownPosition.top -= diff;
        }
        if (dropDownRect.left !== this.dropDownPosition.left) {
          const diff = dropDownRect.left - this.dropDownPosition.left;
          this.dropDownPosition.left -= diff;
        }
        resolve(true);
      }, 0);
    }));
  }

  private getConstrainRect() {
    this.constraintRect = this.constraintElement.getBoundingClientRect();
  }

  private calculateDropDownPosition() {
    if (!this.dropDownEl || !this.dropDownEl.nativeElement) {
      return;
    }
    this.setObserver();
    this.dropDownRect = this.dropDownEl.nativeElement.getBoundingClientRect();
    this.dropDownOffThePage = {
      right: 0,
      left: 0,
      bottom: 0
    };
    this.calculateTopPosition();
    this.calculateLeftPosition();
    this.doubleCheckPosition().then(() => {
      if (this.initializedPosition === false) {
        // run only 1 time
        this.initializedPosition = true;
      }
    });
  }

  private calculateTopPosition() {
    this.getConstrainRect();
    let top = this.constraintRect.top + this.constraintRect.height + 10;
    top = this.correctTopPosition(top, this.dropDownRect.height);
    this.dropDownPosition.top = top;
  }

  /*private checkWidth(elementWidth) {
    const widthRelativeToWindow = Math.floor((elementWidth * 100) / window.innerWidth);
    if (widthRelativeToWindow > 80) {
      // element width is greater than 80 percent of the window
      this.dropDownDimension.width = '80%';
    } else {
      this.dropDownDimension.width = elementWidth + 'px';
    }
  }*/

  private calculateLeftPosition() {
    this.getConstrainRect();

    const widthDiffHalf = (Math.abs((this.dropDownRect.width - this.constraintRect.width))) / 2;
    let left;
    if (this.dropDownRect.width > this.constraintRect.width) {
      left = this.constraintRect.left - widthDiffHalf;
    } else {
      left = this.constraintRect.left + widthDiffHalf;
    }

    const goesOff = {
      left: this.goesOffThePageFromLeft(left),
      right: this.goesOffThePageFromRight(left, this.dropDownRect.width),
    };

    let correctedLeft = left;
    if ((goesOff.left && goesOff.right) || (goesOff.left && !goesOff.right)) {
      // Almost we can't do anything.
      // try with correcting the left
      correctedLeft = this.correctLeftPosition(left, this.dropDownRect.width);
    } else {
      if (goesOff.right) {
        correctedLeft = this.correctRightPosition(left, this.dropDownRect.width);
      }
    }

    this.dropDownPosition.left = correctedLeft;
  }

  private goesOffThePageFromRight(left, elementWidth) {
    return (left + elementWidth + this.positionMargins.right > window.innerWidth);
  }

  private goesOffThePageFromLeft(left) {
    return (left < this.positionMargins.left);
  }

  private correctLeftPosition(left, elementWidth) {
    let correctLeft;
    if (this.goesOffThePageFromLeft(left)) {
      this.dropDownOffThePage.left = Math.abs(left) + 20;
      correctLeft = 20;
    } else {
      correctLeft = left;
      this.dropDownOffThePage.left = 0;
    }

    return correctLeft;
  }

  private correctRightPosition(left, elementWidth) {
    if (this.goesOffThePageFromRight(left, elementWidth)) {
      let diff = Math.floor(Math.abs((left + elementWidth) - window.innerWidth));
      if (this.positionMargins.right) {
        diff += this.positionMargins.right;
      }
      this.dropDownOffThePage.right = diff;
      return left - diff;
    }

    this.dropDownOffThePage.right = 0;

    return left;
  }

  private correctTopPosition(top, elementHeight) {
    const goesOffThePage = (top + elementHeight) >= window.innerHeight;
    if (goesOffThePage) {
      const diff = (top + elementHeight) - window.innerHeight;
      this.dropDownOffThePage.bottom = Math.abs(diff);
      return top - diff;
    } else {
      this.dropDownOffThePage.bottom = 0;
    }

    return top;
  }

  private ipValidation({top, left, bottom, right}) {
    if (top + bottom > window.innerHeight) {
      return false;
    }
    if (left + right > window.innerWidth) {
      return false;
    }
    return true;
  }

  private ipTransform(ip) {
    for (const i in ip) {
      if (ip.hasOwnProperty(i)) {
        ip[i] = ip[i] >= 0 ? ip[i] : 0;
      }
    }
    if (this.ipValidation(ip)) {
      return ip;
    }
    return {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
  }

  /*
  * Observe constraint element movement
  * */
  private setObserver() {
    const rect = this.constraintElement.getBoundingClientRect();
    let ip = {top: 0, left: 0, bottom: 0, right: 0}; // input position
    ip.top = rect.top;
    ip.left = rect.left;
    ip.bottom = window.innerHeight - rect.top - rect.height;
    ip.right = window.innerWidth - rect.left - rect.width;
    ip = this.ipTransform(ip);
    const margin = '-' + ip.top + 'px -' + ip.right + 'px -' + ip.bottom + 'px -' + ip.left + 'px';
    const thresholds = [];
    for (let i = 0; i <= 1; i += i + 0.01) {
      thresholds.push(i);
    }
    let checkFirst = true;
    const moveObserver = new IntersectionObserver((entries, observer) => {
      if (checkFirst) {
        checkFirst = false;
        return false;
      }
      entries.forEach(entry => {
        observer.unobserve(entry.target);
      });
      // delay for scroll or something like scroll
      setTimeout(this.calculateDropDownPosition.bind(this), 200);
    }, {
      threshold: thresholds,
      rootMargin: margin
    });
    moveObserver.observe(this.constraintElement);
  }
}
