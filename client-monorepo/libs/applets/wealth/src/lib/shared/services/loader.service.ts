import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loading: BehaviorSubject<{
    [key: string]: boolean;
  }> = new BehaviorSubject({});

  loaded: Subject<{
    key: string;
    data: any;
  }> = new Subject();

  constructor() {
    this.loaded.asObservable().subscribe((val) => {
      this.setLoading(val.key, false);
    });
  }

  setLoading(key: string, val: boolean) {
    const l = this.loading.getValue();
    l[key] = val;
  }

  isLoading(key: string) {
    const loading = this.loading.getValue();
    return loading.hasOwnProperty(key) && loading[key];
  }

  afterLoad(key: string) {
    return (response: any) => {
      this.loaded.next({
        key,
        data: response,
      });
    };
  }
}
