import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TrafficFinesDto } from '../../../../../../api/digipay/models/driving-fine/fine-config.response';
import { NewPlateFineStates } from '../../car-fine-states';
import { FineDataService } from '../../../services/fine-data.service';
import { FineStateManagerService } from '../../../services/fine-state-manager.service';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiVehicleFineComponent } from '../../../../../../ui/ui-components/ui-driving-fine/ui-vehicle-fine/ui-vehicle-fine.component';
import { UiCardNoticeComponent } from '../../../../../../ui/ui-components/ui-card-notice/ui-card-notice.component';

@Component({
  selector: 'app-last-inquiry-report',
  templateUrl: './last-inquiry-report.component.html',
  styleUrls: ['./last-inquiry-report.component.scss'],
  standalone: true,
  imports: [UiCardNoticeComponent, UiVehicleFineComponent, UiButtonComponent],
})
export class LastInquiryReportComponent implements OnInit {
  @Input()
  trafficFineDto: TrafficFinesDto;

  @Output()
  newPlate = new EventEmitter();

  notices: Array<{
    text: string;
  }> = [];

  @Output()
  payFine = new EventEmitter();

  constructor(
    private fineDataService: FineDataService,
    private fineStateManagerService: FineStateManagerService,
  ) {}

  ngOnInit(): void {
    for (const alert of this.trafficFineDto.reportAlert.descriptionItems) {
      this.notices.push({
        text: alert.note,
      });
    }
  }

  payVehicleFine() {
    this.payFine.emit();
  }

  newInquiry() {
    this.fineDataService.setCarInfo({
      title: '',
      plateNo: this.trafficFineDto.plateNo,
    });

    this.fineStateManagerService.jumpToCertainState(NewPlateFineStates.INQUIRY_METHOD_SELECT);
  }
}
