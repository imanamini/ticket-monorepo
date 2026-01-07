import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { SmartDialog } from '../../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {
  @Input() tacShow: boolean = false;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  constructor(private smartDialog: SmartDialog) {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.smartDialog.close();
  }

}
