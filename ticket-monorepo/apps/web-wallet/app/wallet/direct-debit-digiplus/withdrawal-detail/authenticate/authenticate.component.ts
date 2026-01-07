import { Component, Input, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {
  @Input()
  cellNumber: string;

  constructor(
    public formService: FormService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.formService.create();
    this.getNationalCodeFromQueryParam();
  }

  public clearInput(): void {
    this.formService.state.controls['nationalCode'].reset();
  }

  private getNationalCodeFromQueryParam(): void {
    this.formService.state.patchValue({
      nationalCode: this.activatedRoute.snapshot.queryParams['nationalCode'] || ''
    });
  }
}
