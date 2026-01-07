import { Component, OnInit } from '@angular/core';
import { UnbundledFooterComponent } from '../partials/unbundled-footer/unbundled-footer.component';
import { RouterOutlet } from '@angular/router';
import {
  UnbundledNavigationBarComponent
} from '../partials/unbundled-navigation-bar/unbundled-navigation-bar.component';

@Component({
  selector: 'app-unbundled-layout',
  templateUrl: './unbundled-layout.component.html',
  styleUrls: ['./unbundled-layout.component.scss'],
  standalone: true,
  imports: [UnbundledNavigationBarComponent, RouterOutlet, UnbundledFooterComponent]
})
export class UnbundledLayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
