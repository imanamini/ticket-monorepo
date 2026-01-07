import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location, NgClass, NgStyle } from '@angular/common';
import { shouldGoToPreviousUrl } from '../../../../../utils/history';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-page-title-bar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    MatProgressSpinner,

  ],
  templateUrl: './page-title-bar.component.html',
  styleUrls: ['./page-title-bar.component.scss']
})
export class PageTitleBarComponent implements OnInit {

  // Inputs

  @Input() closeButton: boolean;

  @Input() backButton: boolean;

  @Input() buttonLink: string;

  @Input() title: string;

  @Input() subtitle: string;

  @Input() actionText: string;

  @Input() actionImage: string;

  @Input() actionSpinner = false;

  @Input() noBorderBottom = false;

  @Input() closeText = '';

  @Input() historyPop = false;

  @Input() infoButton: boolean;

  @Input() invertColor = false;

  @Input() backgroundColor: string = null;

  @Input()
  alignment: 'CENTER' | 'RIGHT' = 'CENTER';

  @Input()
  rightTitle: '';

  // Outputs

  @Output() onBackButtonClick = new EventEmitter();

  @Output() onCloseButtonClick = new EventEmitter();

  @Output() infoClick = new EventEmitter();

  @Output() onTextClick = new EventEmitter();

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
    const styles = {};
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

    this.router.navigateByUrl(this.buttonLink).then();
  }

  infoItemClicked($event) {
    this.infoClick.emit($event);
  }
}
