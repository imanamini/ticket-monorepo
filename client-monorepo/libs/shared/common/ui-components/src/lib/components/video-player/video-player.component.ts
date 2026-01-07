import { ChangeDetectionStrategy, Component, ElementRef, input, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'common-ui-components-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent {
  videoUrl = input.required<string>();
  videoType = input('video/mp4');
  autoplay = input(false);
  controls = input(true);
  muted = input(true);
  preload = input<'auto' | 'metadata' | 'none'>('metadata');
  width = input('100%');
  height = input(0);
  poster = input<string | undefined>(undefined);
  styles = input<Record<string, string>>({});

  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;

  constructor() {
    effect(() => {
      const url = this.videoUrl();
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.load();
      }
    });
  }
}
