import {ChangeDetectionStrategy, Component, ElementRef, input, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {visualIntro} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";

@Component({
  selector: 'app-onboarding-video',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-video.component.html',
  styleUrl: './onboarding-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingVideoComponent {

  isModalOpen = signal(false);

  visualIntro = input<visualIntro>();

  @ViewChild('videoOnboarding') videoRef?: ElementRef<HTMLVideoElement>;

  onLoadedMetadata(video: HTMLVideoElement) {
    video?.play();
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    if (this.videoRef) {
      this.videoRef.nativeElement.pause();
      this.videoRef.nativeElement.currentTime = 0;
      this.isModalOpen.set(false);
    }
  }


}
