import { Component, model, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { Buttons } from '@digipay/ngx-status-result';

@Component({
  selector: 'bnpl-error-page',
  templateUrl: './bnpl-error-page.component.html',
  styleUrls: ['./bnpl-error-page.component.scss']
})
export class BnplErrorPageComponent implements OnInit {
  title = signal<string>(null);
  image = signal<string>(null);
  description = signal<string>(null);
  buttons = signal<Buttons[]>(null);
  hasTimer = signal<boolean>(false);
  errorType = model<number>();
  redirectUrl = model<string>();
  changeState = output();
  retry = output();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bnplErrorHandlingService: BnplErrorHandlingService,
  ) {
  }

  ngOnInit(): void {
    const errorType = this.route.snapshot.params.errorType;
    const config = this.bnplErrorHandlingService.getConfig(errorType || this.errorType());
    this.title.set(config.title);
    this.description.set(config.description);
    this.buttons.set(config.buttons);
    this.image.set(config.image);
    this.hasTimer.set(config.hasTimer);
  }

  onCtaClick(id: string): void {
    switch (id) {
      case 'return-to-merchant':
        this.router.navigate(['cancel']);
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
