import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IplService } from '../../services/ipl.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';

@Component({
  selector: 'ipl-cell-number',
  templateUrl: './ipl-cell-number.component.html',
  styleUrl: './ipl-cell-number.component.scss',
})
export class IplCellNumberComponent implements OnInit {

  form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public iplService: IplService,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      cellNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.iplService.setUserCellNumber(this.form.value.cellNumber);
      this.iplService.sendSms().subscribe(_ => {
        this.router.navigate(['../otp-code'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
      });
    }
  }
}
