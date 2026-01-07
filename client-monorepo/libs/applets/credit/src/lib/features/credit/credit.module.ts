import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditRoutingModule } from './credit-routing.module';
import { CreditRouteStateService } from './data-access/services/route-state/credit-route-state.service';

@NgModule({
  imports: [
    CommonModule,
    CreditRoutingModule,
  ],
  providers: [
    {
      provide: 'RouteStateInterface',
      useClass: CreditRouteStateService,
    },
  ],
})

export class CreditModule {}
