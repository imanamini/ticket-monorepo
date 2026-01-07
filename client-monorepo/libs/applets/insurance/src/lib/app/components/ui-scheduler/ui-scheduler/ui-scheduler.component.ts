import { Component, Input, OnInit } from '@angular/core';
import moment from 'jalali-moment';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'ui-scheduler',
  templateUrl: './ui-scheduler.component.html',
  styleUrls: ['./ui-scheduler.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class UiSchedulerComponent implements OnInit {

  @Input()
  endTime: number;

  @Input()
  everyUnit = 1;

  @Input()
  updateUnit: 's' | 'm' = 's';

  fullTime = {
    millisecond: [],
    seconds: [],
    minutes: [],
    hours: [],
    days: [],
  };

  constructor() {
  }

  ngOnInit(): void {

    this.updateScheduler();
    setInterval(() => {
      this.updateScheduler();
    }, this.geUnit());
  }

  geUnit(): number {
    let unit = 0;
    switch (this.updateUnit) {
      case 's' :
        unit = this.everyUnit * 1000;
        break;
      case 'm' :
        unit = this.everyUnit * 60000;
        break;
    }
    return unit;
  }

  updateScheduler(): void {
    const expiration = moment(this.endTime).diff(moment());
    const diffDuration = moment.duration(expiration);
    const option = {minimumIntegerDigits: 2, useGrouping: false};
    this.fullTime.days = [...diffDuration.days().toLocaleString('en-US', option)];
    this.fullTime.hours = [...diffDuration.hours().toLocaleString('en-US', option)];
    if (this.updateUnit === 'm') {
      this.fullTime.minutes = [...diffDuration.minutes().toLocaleString('en-US', option)];
      return;
    }
    if (this.updateUnit === 's') {
      this.fullTime.minutes = [...diffDuration.minutes().toLocaleString('en-US', option)];
      this.fullTime.seconds = [...diffDuration.seconds().toLocaleString('en-US', option)];
    }
  }
}
