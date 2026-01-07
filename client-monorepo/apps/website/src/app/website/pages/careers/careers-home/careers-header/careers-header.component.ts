import {
  AfterContentInit, AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {
  heroSection
} from "../../../../../api/clients/models/templates/careers/careers-template-date";


@Component({
  selector: 'app-careers-header',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './careers-header.component.html',
  styleUrl: './careers-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersHeaderComponent implements OnInit {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  heroSection = input<heroSection>();
  isModalOpen = signal(false);
  isMobileMode = false;

  @ViewChild('fullscreenVideo') videoRef?: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    if (this.videoRef) {
      this.videoRef.nativeElement.pause();
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.load();
      this.isModalOpen.set(false);
    }

  }

  onLoadedMetadata(video: HTMLVideoElement) {
    video?.play();
  }

  checkWindowSize() {
    this.isMobileMode = window.innerWidth < 1280;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }

}
