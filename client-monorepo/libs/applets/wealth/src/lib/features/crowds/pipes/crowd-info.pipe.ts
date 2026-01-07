import { Pipe, PipeTransform } from '@angular/core';
import { CrowdFundingModel } from '../data-access/models';

@Pipe({
  name: 'crowdInfo',
  standalone: true,
})
export class CrowdInfoPipe implements PipeTransform {
  transform(project: CrowdFundingModel): any[] {
    return [
      {
        key: 'پیشبینی سود',
        value: `${project?.profit || project?.profitPercentantage} %`,
      },
      {
        key: 'ضمانت',
        value: project.guaranteeType.split('ضمانت نامه')[1] || project.guaranteeType,
      },
      {
        key: 'بازگشت سرمایه',
        value: `${project.projectDurationInMonth} ماهه`,
      },
    ];
  }
}
