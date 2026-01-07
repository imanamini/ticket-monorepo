import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../../registration.service';

@Component({
  selector: 'step-finished',
  templateUrl: './step-finished.component.html',
  styleUrls: ['./step-finished.component.scss']
})
export class StepFinishedComponent implements OnInit {

  constructor(private service: RegistrationService) { }

  ngOnInit(): void {
  }

  onBack(){
    this.service.redirect('overview');
  }
}
