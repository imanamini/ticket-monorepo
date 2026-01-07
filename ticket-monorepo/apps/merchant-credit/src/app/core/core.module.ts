import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from './message.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {TicketService} from './ticket.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    MessageService,
    MatSnackBarModule,
    TicketService
  ]
})
export class CoreModule {
}
