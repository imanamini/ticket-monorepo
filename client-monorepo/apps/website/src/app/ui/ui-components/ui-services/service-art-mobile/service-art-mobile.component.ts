import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-service-art-mobile',
  templateUrl: './service-art-mobile.component.html',
  styleUrls: ['./service-art-mobile.component.scss', '../base-style.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgStyle],
})
export class ServiceArtMobileComponent implements OnInit {
  @Input()
  images: Array<{
    image: ApiFile;
  }> = [];

  visibleImageIndex: any[] = [];

  act = false;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  ngOnInit(): void {
    if (this.platformId !== 'server') {
      this.showArt();
    }
  }

  showArt() {
    let index = 0;
    const count = this.images.length - 1;

    this.visibleImageIndex.push(0);
    this.visibleImageIndex.push(1);

    setInterval(() => {
      if (index > count) {
        index = 0;
        this.visibleImageIndex = [];
        this.visibleImageIndex.push(0);
      }

      index++;

      this.visibleImageIndex = this.visibleImageIndex.filter((item) => item !== index - 2);
      this.visibleImageIndex.push(index);

      this.act = true;
      of('')
        .pipe(delay(3000))
        .subscribe({
          next: () => {
            if (index === count) {
              this.visibleImageIndex.push(0);
            }
            index++;

            this.visibleImageIndex = this.visibleImageIndex.filter((item) => item !== index - 2);

            this.visibleImageIndex.push(index);

            this.act = false;
          },
        });
    }, 6000);
  }
}
