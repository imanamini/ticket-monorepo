import { Observable } from 'rxjs';

export function Timer(second: number): Observable<number> {
  return new Observable((subscriber) => {
    const interval = setInterval(() => {
      if (second > 0) {
        second--;
        subscriber.next(second);
      } else {
        subscriber.complete();
      }
    }, 1000);
  });

}


