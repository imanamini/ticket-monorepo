import { Component, output, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-notify-me',
  templateUrl: 'notify-me.component.html',
  styleUrls: ['notify-me.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
})
export class NotifyMeComponent {
  loading = signal<boolean>(false);

  notifyMeClicked = output<boolean>();

  notifyMe() {
    this.loading.set(true);
    this.notifyMeClicked.emit(true);
  }
}
