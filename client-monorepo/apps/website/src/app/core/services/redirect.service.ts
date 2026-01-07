import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  redirect(url: string, data: object): void {
    const form = document.createElement('form') as HTMLFormElement;
    form.action = url;
    form.method = 'POST';

    document.body.appendChild(form);
    Object.keys(data).forEach((key) => {
      const input = document.createElement('input') as HTMLInputElement;
      input.type = 'hidden';
      input.name = key;
      input.value = data[key];
      form.appendChild(input);
    });

    form.submit();
  }
}
