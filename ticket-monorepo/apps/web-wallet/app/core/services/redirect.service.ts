import { Base64 } from 'js-base64';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface RedirectFormData {
  key: string;
  value: any;
}

@Injectable()
export class RedirectService {

  url: BehaviorSubject<string> = new BehaviorSubject('');

  formData: Subject<Array<RedirectFormData>> = new Subject();

  redirect: Subject<string> = new Subject();

  /**
   * Converts array of data into key-value object
   */
  static arrayToAppData(array: Array<RedirectFormData>) {
    const data = {};
    array.forEach(item => {
      data[item.key] = item.value;
    });
    return data;
  }

  /**
   * Redirect to the application urls (url schemes)
   *
   */
  static redirectToApp(url, data: any) {

    const encodedData = Base64.encode(JSON.stringify(data));

    const qs = 'data=' + encodedData;

    if (url.indexOf('?') > 0) {
      // already has a query string
      url = url + '&' + qs;
    } else {
      // no query strings, append to the end with a question mark
      url = url + '?' + qs;
    }

    window.location.replace(url);
  }

  /**
   * Set form data and
   * notify the redirect form component to perform a redirection
   */
  setAndRedirect(formData: Array<RedirectFormData>, method = 'POST') {
    this.formData.asObservable().subscribe(d => {
      if (d) {
        setTimeout(() => {
          this.redirect.next(method);
        }, 300);
      }
    });
    this.formData.next(formData);
  }
}
