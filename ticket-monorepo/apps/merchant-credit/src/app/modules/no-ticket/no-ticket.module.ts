import { NgModule } from '@angular/core';
import { UserInterfaceModule } from '../../user-interface/user-interface.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NoTicketComponent } from './no-ticket.component';
import { NoTicketRoutingModule } from './no-ticket-routing.module';

@NgModule({
  declarations: [
    NoTicketComponent
  ],
  imports: [
    CommonModule,
    NoTicketRoutingModule,
    UserInterfaceModule,
    MatIconModule,
  ],
  providers: [],
})
export class NoTicketModule { }
