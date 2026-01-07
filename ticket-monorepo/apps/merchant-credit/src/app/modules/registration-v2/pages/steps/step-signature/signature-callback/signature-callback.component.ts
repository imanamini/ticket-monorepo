import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { RegistrationService } from '../../../../registration.service';

@Component({
  selector: 'signature-callback',
  templateUrl: './signature-callback.component.html',
  styleUrls: ['./signature-callback.component.scss']
})
export class SignatureCallbackComponent implements OnInit {

  isCallBackError: boolean = false;

  result!: {
    success: boolean,
    description: string
  };

  constructor(
    private route: ActivatedRoute,
    private service: RegistrationService
  ) {
  }

  ngOnInit(): void {
    let data = this.route.snapshot.queryParams.data;
    data = decodeURIComponent(data);
    this.result = JSON.parse(Base64.decode(data));
    if (this.result.success) {
      this.service.redirect('step/signature');
    } else {
      this.isCallBackError = true;
    }
  }

  onBackClick(): void {
    this.service.goToOverviewPage();
  }
}
