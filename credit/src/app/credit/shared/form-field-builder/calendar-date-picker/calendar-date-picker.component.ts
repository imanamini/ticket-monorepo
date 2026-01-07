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
import moment from 'jalali-moment';

@Component({
  selector: 'ui-calendar-date-picker',
  templateUrl: './calendar-date-picker.component.html',
  styleUrls: ['./calendar-date-picker.component.scss']
})
export class CalendarDatePickerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  label: string = 'انتخاب تاریخ';

  @Input()
  input: HTMLElement;

  @Input()
  visible = false;

  @Input()
  value: number;

  @Output()
  pick: EventEmitter<moment.Moment> = new EventEmitter();

  @Output()
  close: EventEmitter<moment.Moment> = new EventEmitter();

  @ViewChild('datePickerUi', {
    static: false,
  })
  datePickerUi: ElementRef<HTMLDivElement>;

  @Input()
  allowFuture: boolean = true;

  @Input()
  justFuture: boolean = false;

  @Input()
  checkCallback: Function;

  @Input()
  initialView: 'days' | 'years' | 'months' = 'days';

  selectedDate: moment.Moment;

  view = 'days';

  years: Array<number> = [];

  yearsOffset = 0;

  currentDate: moment.Moment;

  weeks: Array<Array<moment.Moment>> = [];

  today: moment.Moment;

  @Input()
  pickType = 'default';

  position = {
    top: '',
    left: ''
  };

  noSpaceToCenter = false;
  monthList: Array<any> = [];
  private monthPickerWidth = 220;
  private monthPickerHeight = 200;
  private calendarWidth = 360;
  private calendarHeight = 320;

  constructor() {
    this.today = moment();
    if (this.value) {
      this.selectedDate = moment(this.value);
      this.currentDate = this.selectedDate.clone();
      this.currentDateChanged();
    }

    this.reposition = this.reposition.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.currentValue && changes.value.currentValue !== changes.value.previousValue) {
      this.selectedDate = moment(this.value);
      this.currentDate = this.selectedDate.clone();
      this.currentDateChanged();
    }
    if (this.input && changes.visible && changes.visible.currentValue) {
      this.reposition();
    }
  }

  ngOnInit() {
    this.currentDate = this.selectedDate ? this.selectedDate : moment();
    this.currentDateChanged();
    this.makeMonths();

    if (this.pickType === 'month-picker') {
      this.makeYears();
    }

    this.checkInitialView();

    window.addEventListener('resize', this.reposition);
  }

  ngAfterViewInit(): void {
    this.reposition();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.reposition);
  }

  setDaysOfMonth() {
    let weeks = [];

    const days = this.currentDate.locale('fa').jDaysInMonth();

    const startOfMonth = this.currentDate.clone().locale('fa').startOf('month');

    let week = [null, null, null, null, null, null, null];
    for (let day = 0; day < days; day++) {
      let thatDay = startOfMonth.clone().add(day, 'days');
      let dn = 0;

      if (thatDay.day() <= 5) {
        dn = thatDay.day() + 1;
      } else {
        dn = 0;
      }

      week[dn] = thatDay;

      if (dn === 6) {
        weeks.push(week);
        week = [null, null, null, null, null, null, null];
      }

      if (day + 1 >= days) {
        // last week
        weeks.push(week);
      }
    }

    this.weeks = weeks;
  }

  nextMonth() {
    this.currentDate.add(1, 'months');
    this.currentDateChanged();
  }

  prevMonth() {
    this.currentDate.subtract(1, 'months');
    this.currentDateChanged();
  }

  monthView() {
    this.makeMonths();
    this.view = 'months';
  }

  yearView() {
    this.view = 'years';
    this.yearsOffset = 0;
    this.makeYears();
  }

  nextYears() {
    this.yearsOffset += 1;
    this.makeYears();
  }

  prevYears() {
    this.yearsOffset -= 1;
    this.makeYears();
  }

  /*
  |--------------------------------------------------------------------------
  | Check
  |--------------------------------------------------------------------------
  |
  */
  isSelectedDay(day) {
    if (!day) {
      return false;
    }

    return this.selectedDate && day &&
      this.selectedDate.locale('fa').format('YYYY/MM/DD') === day.locale('fa').format('YYYY/MM/DD');
  }

  isDisabledDay(day: moment.Moment) {
    if (!day) {
      return false;
    }

    const isAllowed = this.checkWithCallbackFunction(day);
    if (!isAllowed) {
      return true;
    }

    if (this.justFuture) {
      return +day.format('jYYYYjMMjDD') < +this.today.format('jYYYYjMMjDD');
    }

    return day.isAfter(this.today) && this.allowFuture === false;
  }

  isDisabledYear(year: number) {

    const beginningOfYear = moment(year, 'jYYYY');
    const endOfYear = moment(year + 1, 'jYYYY').subtract(1, 'day');
    if (!this.checkWithCallbackFunction(beginningOfYear) && !this.checkWithCallbackFunction(endOfYear)) {
      return true;
    }
    if (this.justFuture) {
      return parseInt(this.today.locale('fa').format('YYYY'), 0) > year;
    }

    if (this.allowFuture) {
      return false;
    }

    return parseInt(this.today.locale('fa').format('YYYY')) < year;
  }

  isDisabledMonth(month: moment.Moment) {
    if (!this.checkWithCallbackFunction(month) && !this.checkWithCallbackFunction(month.add(1, 'month').subtract(1, 'day'))) {
      return true;
    }

    if (this.justFuture) {
      return +month.format('jYYYYjMM') < +this.today.format('jYYYYjMM');
    }

    return this.allowFuture === false && month.isAfter(this.today);
  }

  /*
  |--------------------------------------------------------------------------
  | CLick Handlers
  |--------------------------------------------------------------------------
  */
  yearClick(year: number) {
    if (!this.isDisabledYear(year)) {
      this.currentDate = moment.from(year + '/01+/01', 'fa', 'YYYY/MM/DD');
      this.monthView();
    }
  }

  monthClick(moment: moment.Moment) {
    if (!this.checkWithCallbackFunction(moment)) {
      return;
    }
    if (this.allowFuture === false && moment.isAfter(this.today)) {
      return;
    }
    if (this.justFuture === true && +moment.format('jYYYYjMM') < +this.today.format('jYYYYjMM')) {
      return;
    }
    this.currentDate = moment.clone();
    this.currentDateChanged();
    this.view = 'days';
  }

  dayClick(moment: moment.Moment) {
    if (moment) {

      const isAllowed = this.checkWithCallbackFunction(moment);
      if (!isAllowed) {
        return;
      }

      if (this.allowFuture === false && moment.isAfter(this.today)) {
        return;
      }
      if (this.justFuture === true && +moment.format('jYYYYjMMjDD') < +this.today.format('jYYYYjMMjDD')) {
        return;
      }

      this.selectedDate = moment;
      this.onPick();
    }
  }

  backdropClick($event) {
    const el = $event.target as HTMLElement;
    if (!el.classList.contains('digipay-date-picker-backdrop')) {
      $event.preventDefault();
      $event.stopPropagation();
      $event.stopImmediatePropagation();
      return;
    }

    this.visible = false;
    this.onClose();
  }

  monthPickerClose(data) {
    if (data.milliseconds) {
      this.selectedDate = moment(data.milliseconds);
      this.onPick();
    } else {
      this.selectedDate = null;
      this.onPick();
    }
  }

  private checkInitialView() {
    this.view = this.initialView;

    switch (this.initialView) {
      case 'days':
        break;
      case 'months':
        break;
      case 'years':
        this.yearView();
        break;
    }
  }

  private currentDateChanged() {
    this.setDaysOfMonth();
  }

  private makeMonths(simple = false): void {
    let months = [];
    const startOfYear = this.currentDate.clone().locale('fa').startOf('year');
    for (let i = 0; i < 12; i++) {
      if (simple) {
        months.push(startOfYear.clone().add(i, 'months').format('MM'));
      } else {
        months.push(startOfYear.clone().add(i, 'months'));
      }
    }

    this.monthList = months;
  }

  private makeYears() {
    let years = [];

    let base = moment();
    if (this.selectedDate) {
      base = this.selectedDate.clone();
    }

    const currentYear = parseInt(base.locale('fa').format('YYYY')) - (this.yearsOffset * 20);
    const page = Math.floor((currentYear - 1) / 20);

    for (let year = (page * 20) + 1; year <= (page + 1) * 20; year++) {
      years.push(year);
    }

    this.years = years;
  }

  /*
  |--------------------------------------------------------------------------
  | Events
  |--------------------------------------------------------------------------
  */

  private checkWithCallbackFunction(moment: moment.Moment) {
    if (!this.checkCallback) {
      // no callback function is defined
      return true;
    }

    return this.checkCallback(moment);
  }

  private onClose() {
    this.close.emit(this.selectedDate);
  }

  private onPick() {
    this.pick.emit(this.selectedDate);
  }

  /*
  |--------------------------------------------------------------------------
  | Positioning
  |--------------------------------------------------------------------------
  |
  */
  private calcTopPosition() {

    const datePickerUiRect = this.datePickerUi.nativeElement.getBoundingClientRect();
    const rect = this.input.getBoundingClientRect();

    let calculatedTop = (rect.top + rect.height + 15);
    const defaultHeight = (this.pickType === 'default' ? this.calendarHeight : this.monthPickerHeight);
    const datePickerHeight = datePickerUiRect.height ? datePickerUiRect.height : defaultHeight;
    if ((calculatedTop + datePickerHeight) > window.innerHeight) {
      let howMuchVerticalSpaceIsNeeded = (calculatedTop + datePickerHeight) - window.innerHeight;
      calculatedTop = calculatedTop - howMuchVerticalSpaceIsNeeded;
    }

    return calculatedTop;
  }

  private calcLeftPosition() {

    const componentWidth = this.pickType === 'default' ? this.calendarWidth : this.monthPickerWidth;

    const rect = this.input.getBoundingClientRect();

    let calculatedLeft = ((rect.width / 2) + rect.left) - (componentWidth / 2);
    const willOverflowX = (calculatedLeft + componentWidth) > window.innerWidth;
    if (willOverflowX) {
      // the calculated left position will cause to
      // item to move outside the page.
      calculatedLeft = window.innerWidth - componentWidth - 20;
    }

    return (calculatedLeft > 10 ? calculatedLeft : 10);
  }

  private reposition() {
    let left = '0px';
    let top = '0px';
    if (this.input) {
      left = this.calcLeftPosition() + 'px';
      top = this.calcTopPosition() + 'px';
    } else {
      this.noSpaceToCenter = false;
    }

    this.position = {
      left,
      top,
    };
  }
}
