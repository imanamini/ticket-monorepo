import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnDestroy, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { SafeUrlPipe } from '@digipay/ng-lib-pipes';
import { StorageService } from '@client-monorepo/common/utilities';
@Component({
  selector: 'profile-applet-chatbot',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, SafeUrlPipe],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  private readonly storageService = inject(StorageService);
  private bottomNavigationService = inject(NgxBottomNavigationService);

  iframeUrl = signal('https://bot.mydigipay.com/faq-4m9h1s7');
  targetOriginUrl = signal('https://bot.mydigipay.com'); // For postMessage targetOrigin

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.iframeUrl.set(this.iframeUrl() + `?env=${this.environment['env']}`);
  }

  private messageListener = (event: MessageEvent) => {
    if (event?.data?.payload?.isLoad === true) {
      window.removeEventListener('message', this.messageListener);
      this.sendToken();
    }
  };

  ngOnInit() {
    this.bottomNavigationService.hide();
    window.addEventListener('message', this.messageListener);
  }

  private sendToken(): void {
    const chatbotElement = document.getElementById('chatbot-iframe') as HTMLIFrameElement;
    if (chatbotElement) {
      const iframeContentWindow = chatbotElement.contentWindow;
      if (!iframeContentWindow) return;
      const userAccessToken: string = this.storageService.getUserData()?.access ?? '';

      iframeContentWindow.postMessage(
        {
          type: 'typebot:set-variables',
          payload: {
            user_token: userAccessToken,
          },
        },
        this.targetOriginUrl(),
      );
    }
  }

  ngOnDestroy() {
    this.bottomNavigationService.show();
    window.removeEventListener('message', this.messageListener);
  }
}
