import { Component, Input, OnInit } from '@angular/core';

import {
  InsurtechCollectionImageCdnComponent
} from '../../../../components/insurtech-collection-image-cdn/insurtech-collection-image-cdn.component';
import { ElectronicEquipment } from '../../api/models/policy/policy.model';

@Component({
  selector: 'policy-general-info',
  templateUrl: './policy-general-info.component.html',
  styleUrls: ['./policy-general-info.component.scss'],
  standalone: true,
  imports: [InsurtechCollectionImageCdnComponent]
})
export class PolicyGeneralInfoComponent implements OnInit {

  @Input()
  electronicEquipment: ElectronicEquipment;

  @Input()
  policyStatus: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
