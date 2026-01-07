import { Pipe, PipeTransform } from '@angular/core';
import { CrowdFundingModel } from '../data-access/models';

@Pipe({
  name: 'crowdIntroductionSegment',
  standalone: true,
})
export class CrowdIntroductionSegmentPipe implements PipeTransform {
  transform(project: CrowdFundingModel): any[] {
    return [
      {
        key: 'ضمانت',
        value: project.guaranteeType,
      },
      {
        key: 'تعداد سرمایه‌گذاران تا این لحظه',
        value: `${project.investorsCount} نفر`,
      },
      {
        key: 'حداقل مبلغ سرمایه‌گذاری',
        value: project.minimumAllowedPrice || '0',
        type: 'currency',
      },
      {
        key: 'تقسیم سود دوره‌ای',
        value: '3 ماهه',
      },
      {
        key: 'متقاضی',
        value: project.companyName,
      },
      {
        key: 'مبلغ نهایی مورد نیاز طرح',
        value: project.totalPrice,
        type: 'currency',
      },
      {
        key: 'مبلغ مورد نیاز برای شروع طرح',
        value: project.minimumRequiredPrice || '0',
        type: 'currency',
      },
      {
        key: 'نوع طرح',
        value: project.faraBourseCrowdFundingType,
      },
    ];
  }
}
