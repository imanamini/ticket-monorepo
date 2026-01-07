import { Pipe, PipeTransform } from '@angular/core';
import { DurationTimeUnitEnum } from '../../api/emuns/duration-time-unit.enum';

@Pipe({
  name: 'translateTimeUnit'
})
export class TranslateTimeUnitPipe implements PipeTransform {

  transform(value: DurationTimeUnitEnum): any {

    if (!value) {
      return value;
    }

    switch (value.toString()) {
      case DurationTimeUnitEnum.YEAR:
        return 'سال';

      case DurationTimeUnitEnum.DAY:
        return 'روز';

      case DurationTimeUnitEnum.HOUR:
        return 'ساعت';

      case DurationTimeUnitEnum.MINUTE:
        return 'دقیقه';

      case DurationTimeUnitEnum.MONTH:
        return 'ماه';

      case DurationTimeUnitEnum.SECOND:
        return 'ثانیه';

      case DurationTimeUnitEnum.WEEK:
        return 'هفته';

      default:
        return 'نامعتبر';
    }
  }

}
