import { Component, Input, OnInit } from '@angular/core';
import { Services } from '../../B2O-landing.response';

@Component({
  selector: 'app-service-item',
  standalone: true,
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss'],
})
export class ServiceItemComponent implements OnInit {
  @Input() item!: Services;
  constructor() {}

  ngOnInit(): void {}
}
