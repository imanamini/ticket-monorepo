import { Component, inject, OnInit, signal } from '@angular/core';
import { GeneralErrorActionModel, GeneralErrorModel } from '../../../data-access/models/general-error.model';
import { ErrorCodes } from '../../../data-access/enums/error-codes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-general-errors',
  templateUrl: './general-errors.component.html',
  styleUrl: './general-errors.component.scss',
  standalone: true,
  imports: [NgxAppBarComponent, NgxButtonComponent, NgClass],
})
export class GeneralErrorsComponent implements OnInit {
  error = signal<GeneralErrorModel | undefined>(undefined);
  errorCodes = ErrorCodes;
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.error.set(this.routeState.getAll());
    if (this.error()) {
      this.error().actions = this.generateActions();
    }
  }

  onBackHandler() {
    this.navigationService.navigate([this.error().actions[0].url]);
  }

  private generateActions(): GeneralErrorActionModel[] {
    const actions: GeneralErrorActionModel[] = [];
    actions.push({
      title: 'متوجه شدم',
      url: '/home',
      type: 'primary',
      width: '100%',
    });
    return actions;
  }
}
