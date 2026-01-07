import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxCalloutMessage } from '@digipay/ngx-callout/lib/data-access/ngx-callout-message';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';

@Component({
  selector: 'stores-applet-store-bullet-info',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxCalloutComponent],
  templateUrl: './store-bullet-info.component.html',
  styleUrl: './store-bullet-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreBulletInfoComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  actionHandler = inject(ActionHandlerService);
  isOpen = input<boolean>(false);
  componentId = input<string>('');
  bullets = input<NgxCalloutMessage[]>([]);
  buttonText = input<string>('');
  buttonIcon = input.required<ButtonIcon>();
  buttonClickUrl = input<string>('');

  clickHandler(): void {
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: this.buttonClickUrl(),
      },
    });
  }
}
