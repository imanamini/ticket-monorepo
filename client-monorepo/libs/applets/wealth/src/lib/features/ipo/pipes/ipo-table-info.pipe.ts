import { Pipe, PipeTransform } from '@angular/core';
import { IIPOProfile } from '../models/ipo-profile.interface';

@Pipe({
  name: 'ipoTableInfo',
  standalone: true,
})
export class IPOTableInfoPipe implements PipeTransform {
  transform(profile: IIPOProfile): IIPOTable[] {
    return [
      { key: 'نام شرکت', value: profile.companyFullName },
      { key: 'تعداد سهام قابل عرضه', value: profile.volume, type: 'number' },
      { key: 'حداکثر سهم قابل خرید توسط هر شخص حقیقی', value: profile.volumePerIndiviual, type: 'number' },
      { key: 'تاریخ عرضه', value: profile.date?.split(' ')[0] },
      {
        key: 'قیمت ثبت درخواست',
        value: profile.price ? 'قیمت کشف شده در فرایند عرضه' : '',
      },
    ];
  }
}

interface IIPOTable {
  key: string;
  value: string;
  type?: string;
}
