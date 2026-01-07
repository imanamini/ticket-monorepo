import { Component, inject } from '@angular/core';
import { Error } from '../error';
import { OFFLINE_ERROR_STATE } from './offline-error-const';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss']
})
export class OfflineComponent extends Error{
  public state = OFFLINE_ERROR_STATE;
  private activatedRoute = inject(ActivatedRoute);

}
