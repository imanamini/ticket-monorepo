import { PersianTimeModel } from '../features/equipment/models/persian-date.model';

export class PersianTime {

  private time;

  private option = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };

  constructor(Time?) {
    if (!Time) {
      this.time = '--';
    } else {
      this.time = Time;
    }
  }

  private removeDate(): void {
    delete this.option.day;
    delete this.option.month;
    delete this.option.year;
  }

  setWeekDay(): this {
    Object.assign(this.option, {weekday: 'long'});
    return this;
  }

  private year(year: 'numeric' | '2-digit' = 'numeric'): this {
    Object.assign(this.option, {year});
    return this;
  }

  private month(month: 'numeric' | 'long' = 'numeric'): this {
    Object.assign(this.option, {month});
    return this;
  }

  private setMD_H_M(): this {
    Object.assign(this.option, {hour: 'numeric', minute: 'numeric'});
    return this;
  }

  private setMD_H_M_S(): this {
    Object.assign(this.option, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
    return this;
  }

  private setH_M(): this {
    this.removeDate();
    Object.assign(this.option, {hour: 'numeric', minute: 'numeric'});
    return this;
  }

  private setH_M_S(): this {
    this.removeDate();
    Object.assign(this.option, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
    return this;
  }

  private set_date(): this {
    this.removeDate();
    Object.assign(this.option);
    return this;
  }

  convert(format?: PersianTimeModel): string {
    if (format || format === 0) {
      switch (format) {
        case PersianTimeModel.HM :
          this.setH_M();
          break;
        case PersianTimeModel.HMS :
          this.setH_M_S();
          break;
        case PersianTimeModel.YYYY_M_D :
          this.set_date();
          break;
        case PersianTimeModel.YY_MD_HM :
          this.year('2-digit');
          this.setMD_H_M();
          break;
        case PersianTimeModel.YY_MD_HMS :
          this.year('2-digit');
          this.setH_M_S();
          break;
        case PersianTimeModel.YYYY_MD_HM :
          this.setMD_H_M();
          break;
        case PersianTimeModel.YYYY_MD_HMS :
          this.setMD_H_M_S();
          break;
        case PersianTimeModel.YY_MD :
          this.year('2-digit');
          break;
        case PersianTimeModel.YYYY_MD :
          break;
        default:
          break;
      }
    }
    if (this.time === '--') {
      return '--';
    }
    // @ts-ignore
    return new Intl.DateTimeFormat('fa-IR', this.option).format(this.time).split(',').join(' ');
  }

}
