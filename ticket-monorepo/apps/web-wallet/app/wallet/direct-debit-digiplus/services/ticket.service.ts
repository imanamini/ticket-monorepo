import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class TicketService {

  state: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((res) => {
      if (res.ticket) {
        this.state = res['ticket'];
      }
    });
  }

  public get(): string {
    if (this.state) {
      return this.state;
    } else {
      return this.activatedRoute.snapshot.params['ticket'];
    }
  }
}
