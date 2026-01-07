import { ChangeDetectionStrategy, Component, inject, model, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'bnpl-error-page',
  templateUrl: './bnpl-error-page.component.html',
  styleUrls: ['./bnpl-error-page.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxStatusResultModule, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplErrorPageComponent implements OnInit {
  title = signal<string | null>(null);
  image = signal<string | null>(null);
  description = signal<string | null>(null);
  buttons = signal<Buttons[] | null>(null);
  hasTimer = signal<boolean>(false);
  errorType = model<number>();
  redirectUrl = model<string>();
  changeState = output();
  retry = output();
  timer = signal<TimerCountDownModel>({
    timeInSeconds: 10,
    timerType: 'mm:ss',
  });

  route = inject(ActivatedRoute);
  bnplErrorHandlingService = inject(BnplErrorHandlingService);

  ngOnInit(): void {
    const errorType = this.route.snapshot.params['errorType'];
    const config = this.bnplErrorHandlingService.getConfig(errorType || this.errorType());
    this.title.set(config.title!);
    this.description.set(config.description!);
    this.buttons.set(config.buttons!);
    this.image.set(config.image!);
    this.hasTimer.set(config.hasTimer!);
  }

  onCtaClick(id: string): void {
    switch (id) {
      case 'return-to-merchant':
        window.location.replace('https://www.digikala.com');
        return;
      case 'retry':
        this.retry.emit();
        return;
      case 'back-to-info-form':
        this.changeState.emit();
        return;
    }
  }
}
