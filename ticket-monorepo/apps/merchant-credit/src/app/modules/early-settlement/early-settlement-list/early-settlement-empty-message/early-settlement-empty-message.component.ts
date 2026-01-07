import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-early-settlement-empty-message',
  templateUrl: './early-settlement-empty-message.component.html',
  styleUrls: ['./early-settlement-empty-message.component.scss']
})
export class EarlySettlementEmptyMessageComponent implements OnInit {

  @Input()
  hasFilter: boolean = false;

  @Input()
  statusName: string = '';

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.configService.exit();
  }

}
