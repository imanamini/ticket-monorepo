import {ChangeDetectionStrategy, Component, effect, input, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {delay, interval, of} from "rxjs";

export interface Timer {
  text: string,
  days: string,
  hours: string,
  minutes: string,
  seconds: string
}

@Component({
  selector: 'app-campaign-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-timer.component.html',
  styleUrl: './campaign-timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignTimerComponent implements OnInit {

  title = input<string>();
  subtitle = input<string>();
  templateData = input<Record<string, any>>({});

  timer = signal<Partial<Timer>>({
    text: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: ''
  });


  constructor() {
    effect(() => {
      const data = this.templateData();
      if (!data?.startTime || !data?.deadline) return;

      const startDate = new Date(data.startTime).getTime();
      const endDate = new Date(data.deadline).getTime();

     interval(1000).subscribe(() => {
        const now = Date.now();
        const pad = (num: number) => num.toString().padStart(2, '0');

        if (now < startDate) {
          const timeLeft = startDate - now;
          this.timer.set({
            text: 'تا شروع جشنواره باقیمانده!',
            days: pad(Math.floor(timeLeft / (1000 * 60 * 60 * 24))),
            hours: pad(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
            minutes: pad(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))),
            seconds: pad(Math.floor((timeLeft % (1000 * 60)) / 1000)),
          });
        } else if (now >= startDate && now <= endDate) {
          const timeLeft = endDate - now;
          this.timer.set({
            text: 'تا پایان جشنواره باقیمانده!',
            days: pad(Math.floor(timeLeft / (1000 * 60 * 60 * 24))),
            hours: pad(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
            minutes: pad(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))),
            seconds: pad(Math.floor((timeLeft % (1000 * 60)) / 1000)),
          });
        } else {
          this.timer.set({
            text: 'کمپین به پایان رسید',
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
          });
        }
      });
    });

  }

  ngOnInit(): void {

  }
}
