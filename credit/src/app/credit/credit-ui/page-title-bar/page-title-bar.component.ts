import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { shouldGoToPreviousUrl } from '../../../utils/history';

@Component({
  selector: 'app-page-title-bar',
  templateUrl: './page-title-bar.component.html',
  styleUrls: ['./page-title-bar.component.scss']
})
export class PageTitleBarComponent implements OnInit {

  @Input() closeButton: boolean;

  @Input() backButton: boolean;

  @Input() buttonLink: string;

  @Input() title: string;

  @Input() subtitle: string;

  @Output() onBackButtonClick = new EventEmitter();

  @Output() onCloseButtonClick = new EventEmitter();

  @Input() actionText: string;

  @Output() onTextClick = new EventEmitter();

  @Input() actionSpinner: boolean = false;

  @Input() noBorderBottom = false;

  @Input() closeText = '';

  @Input() historyPop: boolean = false;

  @Input() infoButton: boolean;

  @Input() invertColor = false;

  @Input() backgroundColor: string = null;

  @Output() infoClick = new EventEmitter();

  @Input()
  alignment: 'CENTER' | 'RIGHT' = 'CENTER';

  constructor(
    private router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
  }

  backButtonClick($event) {
    if (this.historyPop) {
      window.history.back();
      return;
    }
    if (!this.buttonLink) {
      this.onBackButtonClick.emit($event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  closeButtonClick($event) {
    if (this.historyPop) {
      window.history.back();
      return;
    }
    if (!this.buttonLink) {
      this.onCloseButtonClick.emit($event);
    } else {
      this.navigateToTheGivenPath();
    }
  }

  actionTextClick($event) {
    if (this.actionText) {
      this.onTextClick.emit($event);
    }
  }

  getStyles() {
    let styles = {};
    if (this.noBorderBottom) {
      styles['borderBottom'] = 'none';
    }
    if (this.backgroundColor) {
      styles['backgroundColor'] = this.backgroundColor;
    }

    return styles;
  }

  navigateToTheGivenPath() {

    if (shouldGoToPreviousUrl()) {
      this.location.back();
      return;
    }

    this.router.navigateByUrl(this.buttonLink);
  }

  infoItemClicked($event) {
    this.infoClick.emit($event);
  }
}
