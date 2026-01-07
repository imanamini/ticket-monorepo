import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { SmartDropDownService } from '../smart-drop-down.service';

@Component({
  selector: 'credit-ui-input-drop-down',
  templateUrl: './input-drop-down.component.html',
  styleUrls: ['./input-drop-down.component.scss']
})
export class InputDropDownComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  open = false;

  @Input()
  width = '300px';

  @Input()
  height = '300px';

  @Input()
  relativeTo: HTMLElement;

  styles = {};

  @ViewChild('dropDown', {
    static: false,
  })
  dropDownEl: ElementRef<HTMLDivElement>;

  constructor(
    private smartDropDownService: SmartDropDownService,
  ) {
    this.smartDropDownService.openDropDown.asObservable().subscribe(open => {
      this.open = open;
    });

    this.makeStyles = this.makeStyles.bind(this);

    this.makeStyles();
  }

  ngOnInit() {
    this.makeStyles();

    window.addEventListener('resize', this.makeStyles);

    window.addEventListener('scroll', this.makeStyles);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let makeStylesUponChange = ['width', 'relativeTo'];
    makeStylesUponChange.forEach(property => {
      if (changes[property] &&
        changes[property].currentValue !== changes[property].previousValue) {
        this.makeStyles();
      }
    });
  }

  ngAfterViewInit(): void {
    this.makeStyles();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.makeStyles);
    window.removeEventListener('scroll', this.makeStyles);
  }

  backdropClick($event) {
    if ($event.target.matches('.backdrop')) {
      this.smartDropDownService.closeSignal.next(true);
    }
  }

  private makeStyles() {
    let styles = {};

    if (this.relativeTo) {
      styles['width'] = this.calcWidth() + 'px';
    }

    if (this.dropDownEl) {
      styles['left'] = this.calcLeftPosition() + 'px';
      styles['top'] = this.calcTopPosition() + 'px';
    }

    this.styles = styles;
  }

  private getRelativeEl() {
    return this.relativeTo as HTMLElement;
  }

  private calcWidth() {
    let el = this.getRelativeEl();
    return parseInt(String(el.getBoundingClientRect().width));
  }

  private calcTopPosition() {
    const datePickerUiRect = this.dropDownEl.nativeElement.getBoundingClientRect();
    const rect = this.relativeTo.getBoundingClientRect();
    let calculatedTop = (rect.top + rect.height + 15);
    const defaultHeight = parseInt(this.height);
    const datePickerHeight = datePickerUiRect.height ? datePickerUiRect.height : defaultHeight;
    if ((calculatedTop + datePickerHeight) > window.innerHeight) {
      let howMuchVerticalSpaceIsNeeded = (calculatedTop + datePickerHeight) - window.innerHeight;
      calculatedTop = calculatedTop - howMuchVerticalSpaceIsNeeded;
    }

    return calculatedTop;
  }

  private calcLeftPosition() {

    const componentWidth = this.calcWidth();

    const rect = this.relativeTo.getBoundingClientRect();

    let calculatedLeft = ((rect.width / 2) + rect.left) - (componentWidth / 2);
    const willOverflowX = (calculatedLeft + componentWidth) > window.innerWidth;
    if (willOverflowX) {
      // the calculated left position will cause to
      // item to move outside the page.
      calculatedLeft = window.innerWidth - componentWidth - 20;
    }

    return (calculatedLeft > 10 ? calculatedLeft : 10);
  }

}
