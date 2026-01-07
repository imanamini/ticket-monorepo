import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class LandingFooterComponent implements OnInit {
  isDesktop = true;
  isServiceExpanded = false;
  isAboutUsExpanded = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isDesktop = event.target.innerWidth >= 1280;
  }

  ngOnInit(): void {
    this.isDesktop = window.innerWidth >= 1280;
  }

  toggleServiceExpand() {
    this.isServiceExpanded = !this.isServiceExpanded;
  }

  toggleAboutUsExpand() {
    this.isAboutUsExpanded = !this.isAboutUsExpanded;
  }

  handleLink(link: string) {
    window.open(link, '_self');
  }
}
