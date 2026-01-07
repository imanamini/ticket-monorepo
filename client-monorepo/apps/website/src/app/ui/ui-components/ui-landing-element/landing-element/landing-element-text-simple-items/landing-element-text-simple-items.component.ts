import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { LandingElementTextCardPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-landing-element-text-simple-items',
  templateUrl: './landing-element-text-simple-items.component.html',
  styleUrls: ['./landing-element-text-simple-items.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class LandingElementTextSimpleItemsComponent implements AfterViewInit {
  @Input() payload: LandingElementTextCardPayload;
  @Output() showDialog = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    for (let i = 0; i < this.elementRef.nativeElement.getElementsByTagName('a').length; i++) {
      this.elementRef.nativeElement.getElementsByTagName('a')[i].addEventListener('click', this.onClick.bind(this));
    }
  }

  onClick(event) {
    if (event.target.title === 'modal') {
      event.preventDefault();
      const url = event.target.href;
      this.showDialog.emit(url.substring(url.lastIndexOf('/') + 1));
    }
  }
}
