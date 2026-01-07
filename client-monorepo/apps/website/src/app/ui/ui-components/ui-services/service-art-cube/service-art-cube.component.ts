import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { NgClass, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-service-art-cube',
  templateUrl: './service-art-cube.component.html',
  styleUrls: ['./service-art-cube.component.scss', '../base-style.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgStyle],
})
export class ServiceArtCubeComponent implements OnInit {
  @Input()
  images: Array<{
    image: ApiFile;
  }> = [];

  visibleImageIndex: any[] = [];

  act = false;

  cubeClass = '';

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  ngOnInit(): void {
    if (this.platformId !== 'server') {
      this.showArt();
    }
  }

  showArt() {
    const artClass = ['show-front', 'show-back', 'show-left', 'show-right', 'show-top', 'show-bottom'];
    let art = 0;

    setInterval(() => {
      if (art >= artClass.length) {
        art = 0;
      }
      this.cubeClass = artClass[art];
      art++;
    }, 5000);
  }
}
