import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss']
})
export class FormSectionComponent implements OnInit {

  @Input()
  sectionTitle!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
