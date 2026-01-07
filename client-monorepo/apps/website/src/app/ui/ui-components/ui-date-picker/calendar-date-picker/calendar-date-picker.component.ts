import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import moment from 'jalali-moment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgClass, NgStyle, NgIf, NgFor, isPlatformBrowser } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-ui-calendar-date-picker-dep',
  templateUrl: './calendar-date-picker.component.html',
  styleUrls: ['./calendar-date-picker.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, NgFor, DatePickerComponent, ReactiveFormsModule, FormsModule],
})
export class CalendarDatePickerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input()
  label = 'انتخاب تاریخ';

  @Input()
  input!: HTMLElement;

  @Input()
  visible = false;

  @Input()
  endPicker = false;

  @Input()
  value!: number;

  @Input()
  showTime = true;

  @Output()
  pick: EventEmitter<moment.Moment> = new EventEmitter();

  @Output()
  emitClose: EventEmitter<moment.Moment> = new EventEmitter();

  @ViewChild('datePickerUi', {
    static: false,
  })
  datePickerUi!: ElementRef<HTMLDivElement>;

  @Input()
  allowFuture = true;

  @Input()
  allowPast = true;

  @Input()
  checkCallback!: any;

  @Input()
  initialView: 'days' | 'years' | 'months' = 'days';

  selectedDate!: moment.Moment;

  view = 'days';

  years: Array<number> = [];

  yearsOffset = 0;

  currentDate!: moment.Moment;

  weeks: Array<Array<moment.Moment>> = [];

  today: moment.Moment;

  @Input()
  pickType = 'default';

  position = {
    top: '',
    left: '',
  };

  timeHour = '00';
  timeMinute = '00';
  timeSecond = '00';
  timeMiliSecond = '000';
  noSpaceToCenter = false;
  monthList: Array<any> = [];
  private monthPickerWidth = 220;
  private monthPickerHeight = 200;
  private calendarWidth = 360;
  private calendarHeight = 400;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
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
    if (this.platformId.toUpperCase() === 'SERVER') {
      return;
    }
    this.currentDate = this.selectedDate ? this.selectedDate : moment();
    this.currentDateChanged();
    this.makeMonths();

    if (this.pickType === 'month-picker') {
      this.makeYears();
    }

    if (this.endPicker) {
      this.timeHour = '23';
      this.timeMinute = '59';
      this.timeSecond = '59';
      this.timeMiliSecond = '999';
    }

    this.checkInitialView();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.reposition);
    }
  }

  ngAfterViewInit(): void {
    of('')
      .pipe(delay(200))
      .subscribe({
        next: () => {
          this.reposition();
          this.initClock();
        },
      });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.reposition);
    }
  }

  setDaysOfMonth() {
    const weeks = [];

    const days = this.currentDate.locale('fa').jDaysInMonth();

    const startOfMonth = this.currentDate.clone().locale('fa').startOf('month');

    let week = [null, null, null, null, null, null, null];
    for (let day = 0; day < days; day++) {
      const thatDay = startOfMonth.clone().add(day, 'days');
      let dn = 0;

      if (thatDay.day() <= 5) {
        dn = thatDay.day() + 1;
      } else {
        dn = 0;
      }

      // @ts-ignore
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

    // @ts-ignore
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
  isSelectedDay(day: any) {
    if (!day) {
      return false;
    }

    return this.selectedDate && day && this.selectedDate.locale('fa').format('YYYY/MM/DD') === day.locale('fa').format('YYYY/MM/DD');
  }

  isDisabledDay(day: moment.Moment) {
    if (!day) {
      return false;
    }

    const isAllowed = this.checkWithCallbackFunction(day);
    if (!isAllowed) {
      return true;
    }

    if (!this.allowFuture) {
      return day.isAfter(this.today);
    } else if (!this.allowPast) {
      return day.isBefore(this.today);
    } else {
      return false;
    }
  }

  isDisabledYear(targetYear: number) {
    const currentYear = parseInt(this.today.locale('fa').format('YYYY'), 10);

    const isAllowed = this.checkWithCallbackFunction(moment(targetYear, 'jYYYY'));
    if (isAllowed === false) {
      return true;
    }
    if (!this.allowFuture) {
      return currentYear < targetYear;
    } else if (!this.allowPast) {
      return currentYear > targetYear;
    } else {
      return false;
    }
  }

  isDisabledMonth(month: moment.Moment) {
    if (!this.checkWithCallbackFunction(month)) {
      return true;
    }

    const selectedYear = parseInt(this.currentDate.locale('fa').format('YYYY'), 10);
    const currentYear = parseInt(this.today.locale('fa').format('YYYY'), 10);
    const targetMonth = parseInt(month.locale('fa').format('MM'), 10);
    const currentMonth = parseInt(this.today.locale('fa').format('MM'), 10);

    if (!this.allowFuture) {
      return targetMonth > currentMonth && selectedYear === currentYear;
    } else if (!this.allowPast) {
      return targetMonth < currentMonth && selectedYear === currentYear;
    } else {
      return false;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Click Handlers
  |--------------------------------------------------------------------------
  */
  yearClick(year: number) {
    if (!this.isDisabledYear(year)) {
      this.currentDate = moment.from(year + '/01+/01', 'fa', 'YYYY/MM/DD');
      this.monthView();
    }
  }

  monthClick(month: moment.Moment): void {
    if (!this.checkWithCallbackFunction(month)) {
      return;
    }

    if (!this.isDisabledMonth(month)) {
      this.currentDate = month.clone();
      this.currentDateChanged();
      this.view = 'days';
    } else {
      return;
    }
  }

  dayClick(day: moment.Moment): boolean {
    if (day) {
      if (!this.allowFuture && day.isAfter(this.today)) {
        return false;
      } else if (!this.allowPast && day.isBefore(this.today)) {
        return false;
      }

      this.selectedDate = day;
      this.setTime();
    }

    return false;
  }

  backdropClick($event: any) {
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

  monthPickerClose(data: any) {
    if (data.milliseconds) {
      this.selectedDate = moment(data.milliseconds);
      this.onPick();
    } else {
      // @ts-ignore
      this.selectedDate = null;
      this.onPick();
    }
  }

  ipValidation({ top, left, bottom, right }: any) {
    if (this.platformId.toUpperCase() === 'SERVER') {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      if (top + bottom > window.innerHeight) {
        return false;
      }
      return left + right <= window.innerWidth;
    }
  }

  ipTransform(ip: any) {
    for (const i in ip) {
      if (Object.prototype.hasOwnProperty.call(ip, i)) {
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
      bottom: 0,
    };
  }

  doubleCheckPosition(): Promise<any> {
    return new Promise<void>((resolve) => {
      of('')
        .pipe(delay(0))
        .subscribe({
          next: () => {
            if (!this.datePickerUi || !this.datePickerUi.nativeElement) {
              return resolve();
            }
            const dropDownRect = this.datePickerUi.nativeElement.getBoundingClientRect();
            let positionTop = parseInt(this.position.top, 10);
            let positionLeft = parseInt(this.position.left, 10);
            if (dropDownRect.top !== positionTop) {
              const diff = dropDownRect.top - positionTop;
              positionTop -= diff;
            }
            if (dropDownRect.left !== positionLeft) {
              const diff = dropDownRect.left - positionLeft;
              positionLeft -= diff;
            }
            this.position = {
              top: positionTop + 'px',
              left: positionLeft + 'px',
            };
            resolve();
          },
        });
    });
  }

  convertToClockType(val: any) {
    const integerVal = Number.parseInt(val, 10);
    if (val.length === 0 || val === '0') {
      return '00';
    } else if (integerVal < 10 && val !== '00') {
      return '0' + integerVal;
    } else {
      return val;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Events
  |--------------------------------------------------------------------------
  */

  initClock() {
    if (this.selectedDate) {
      this.timeHour = this.convertToClockType(this.selectedDate.hour());
      this.timeMinute = this.convertToClockType(this.selectedDate.minute());
      this.timeSecond = this.convertToClockType(this.selectedDate.second());
      this.timeMiliSecond = this.convertToClockType(this.selectedDate.millisecond());
    }
  }

  setTime(event: any = null) {
    if (event) {
      const target = event.target;
      target.value = this.convertToClockType(target.value);
    }
    this.selectedDate
      .hour(parseInt(this.timeHour, 10))
      .minute(parseInt(this.timeMinute, 10))
      .second(parseInt(this.timeSecond, 10))
      .millisecond(parseInt(this.timeMiliSecond, 10));
    this.onPick();
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
    const months = [];
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
    const years = [];

    let base = moment();
    if (this.selectedDate) {
      base = this.selectedDate.clone();
    }

    const currentYear = parseInt(base.locale('fa').format('YYYY'), 10) - this.yearsOffset * 20;
    const page = Math.floor(currentYear / 20);

    for (let year = page * 20; year < (page + 1) * 20; year++) {
      years.push(year);
    }

    this.years = years;
  }

  private checkWithCallbackFunction(moment: moment.Moment) {
    if (!this.checkCallback) {
      // no callback function is defined
      return true;
    }

    return this.checkCallback(moment);
  }

  private onClose() {
    this.emitClose.emit(this.selectedDate);
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
    if (this.platformId.toUpperCase() === 'SERVER') {
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      const datePickerUiRect = this.datePickerUi.nativeElement.getBoundingClientRect();
      const rect = this.input.getBoundingClientRect();

      let calculatedTop = rect.top + rect.height + 15;
      const defaultHeight = this.pickType === 'default' ? this.calendarHeight : this.monthPickerHeight;
      const datePickerHeight = datePickerUiRect.height ? datePickerUiRect.height : defaultHeight;

      if (calculatedTop + datePickerHeight > window.innerHeight) {
        const howMuchVerticalSpaceIsNeeded = calculatedTop + datePickerHeight - window.innerHeight;
        calculatedTop = calculatedTop - howMuchVerticalSpaceIsNeeded;
      }
      return calculatedTop;
    }
  }

  private calcLeftPosition() {
    if (isPlatformBrowser(this.platformId)) {
      const componentWidth = this.pickType === 'default' ? this.calendarWidth : this.monthPickerWidth;

      const rect = this.input.getBoundingClientRect();

      let calculatedLeft = rect.width / 2 + rect.left - componentWidth / 2;
      const willOverflowX = calculatedLeft + componentWidth > window.innerWidth;
      if (willOverflowX) {
        // the calculated left position will cause to
        // item to move outside the page.
        calculatedLeft = window.innerWidth - componentWidth - 20;
      }
      return calculatedLeft > 10 ? calculatedLeft : 10;
    }
  }

  private setObseverver() {
    if (isPlatformBrowser(this.platformId)) {
      const rect = this.input.getBoundingClientRect();
      let ip = { top: 0, left: 0, bottom: 0, right: 0 }; // input position
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
      const moveObserver = new IntersectionObserver(
        (entries, observer) => {
          if (checkFirst) {
            checkFirst = false;
            return false;
          }
          entries.forEach((entry) => {
            observer.unobserve(entry.target);
          });
          // delay for scroll or something like scroll
          of('')
            .pipe(delay(200))
            .subscribe({
              next: () => {
                this.reposition();
              },
            });
        },
        {
          threshold: thresholds,
          rootMargin: margin,
        },
      );
      moveObserver.observe(this.input);
    }
  }

  private reposition() {
    this.setObseverver();
    let left = '0px';
    let top = '0px';
    if (this.input && this.datePickerUi && this.datePickerUi.nativeElement) {
      left = this.calcLeftPosition() + 'px';
      top = this.calcTopPosition() + 'px';
    } else {
      this.noSpaceToCenter = false;
    }

    this.position = {
      left,
      top,
    };
    this.doubleCheckPosition();
  }
}
