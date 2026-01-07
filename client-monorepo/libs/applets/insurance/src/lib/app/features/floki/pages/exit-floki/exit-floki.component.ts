import { Component, inject } from '@angular/core';
import { NgxAlert } from '@digipay/ngx-alert';
import { ActivatedRoute, Router } from '@angular/router';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { DpxService } from '../../../../data-access/services/dpx.service';
@Component({
  selector: 'exit-floki',
  standalone: true,
  imports: [NgxAlert, NgxButtonComponent],
  templateUrl: './exit-floki.component.html',
  styleUrl: './exit-floki.component.scss',
})
export class ExitFlokiComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  private dpxService = inject(DpxService);

  goToHealthCheck(): void {
    this.router
      .navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.CompleteInfo], {
        queryParams: { [QueryParamsEnum.ApplicationId]: this.route.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId) },
      })
      .then();
  }

  onExit(): void {
    this.router.navigate(['/']).then();
  }
}
