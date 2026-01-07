import { Component, signal } from '@angular/core';
import { InternetConnectionLostService } from './internet-connection-lost.service';
import { delay } from 'rxjs';

@Component({
  selector: 'internet-connection-lost',
  standalone: true,
  imports: [  ],
  templateUrl: 'internet-connection-lost.component.html',
  styleUrl: './internet-connection-lost.component.scss'
})
export class InternetConnectionLostComponent {

  isOffline = signal<boolean>(false);

  constructor(
    public internetConnectionLostService: InternetConnectionLostService,
  ) {
    this.internetConnectionLostService.isOffline$.pipe(delay(5000)).subscribe({
      next: value => {
        this.isOffline.set((value));
      }
    });
  }

}
