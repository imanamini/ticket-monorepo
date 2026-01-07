import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-app-change-banners-date-time',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, FormsModule, NgxButtonComponent],
  templateUrl: './change-banner-date-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeBannerDateTimeComponent implements OnInit {
  date = signal(+localStorage.getItem('ab-banner-date-time') || Date.now());
  time = signal(localStorage.getItem('ab-banner-date-time') || '00:00');

  ngOnInit(): void {
    if (localStorage.getItem('ab-banner-date-time')) {
      const date: Date = new Date(+localStorage.getItem('ab-banner-date-time'));
      this.date.set(+date);
      this.time.set(date.getHours() + ':'  + date.getMinutes());
    }
  }

  removeDateTime() {
    localStorage.removeItem('ab-banner-date-time');
    window.location.reload();
  }
  updateDateTime() {
    const [h, m]= this.time().split(':');
    const dateTime = +new Date(this.date()).setHours(+h, +m);
    localStorage.setItem('ab-banner-date-time', '' + dateTime);
    window.location.reload();
  }
}
