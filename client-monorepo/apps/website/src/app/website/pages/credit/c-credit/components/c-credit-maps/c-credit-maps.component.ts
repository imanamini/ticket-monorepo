import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {isPlatformBrowser, NgFor} from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';
import { delay, of } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';

declare let ol: any;

@Component({
  selector: 'app-c-credit-maps',
  templateUrl: './c-credit-maps.component.html',
  styleUrls: ['./c-credit-maps.component.scss'],
  standalone: true,
  imports: [NgFor, UiIconDirective, UiButtonComponent, NgxIcon],
})
export class CCreditMapsComponent implements OnInit {
  public map!: any;

  @Input()
  data!: any;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap() {
    if (isPlatformBrowser(this.platformId)) {
      const polyfill = document.createElement('script');
      polyfill.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL';
      document.body.appendChild(polyfill);

      const neshan = document.createElement('script');
      neshan.src = 'https://static.neshan.org/sdk/openlayers/5.3.0/ol.js';
      neshan.setAttribute('type', 'text/javascript');
      document.body.appendChild(neshan);

      const neshanLink = document.createElement('link');
      neshanLink.setAttribute('href', 'https://static.neshan.org/sdk/openlayers/5.3.0/ol.css');
      neshanLink.setAttribute('rel', 'stylesheet');
      neshanLink.setAttribute('type', 'text/css');
      document.body.appendChild(neshanLink);

      of('')
        .pipe(delay(2000))
        .subscribe({
          next: () => {
            for (const map in this.data.addresses) {
              this.map = new ol.Map({
                target: 'map' + map,
                key: 'web.5703d8158dec41dbb2f85233860a746c',
                maptype: 'neshan',
                poi: true,
                traffic: false,
              });
              // }

              const view = new ol.View({
                center: ol.proj.fromLonLat([
                  parseFloat(this.data.addresses[map].location.lon.path),
                  parseFloat(this.data.addresses[map].location.lat.path),
                ]),
                zoom: 17,
              });

              this.map.setView(view);

              const layer = new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [
                    new ol.Feature({
                      geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([
                          parseFloat(this.data.addresses[map].location.lon.path),
                          parseFloat(this.data.addresses[map].location.lat.path),
                        ]),
                      ),
                    }),
                  ],
                }),
              });
              this.map.addLayer(layer);

              const container = document.getElementById('popup' + map);

              const overlay = new ol.Overlay({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                  duration: 250,
                },
              });
              overlay.setPosition(
                ol.proj.fromLonLat([
                  parseFloat(this.data.addresses[map].location.lon.path),
                  parseFloat(this.data.addresses[map].location.lat.path),
                ]),
              );
              this.map.addOverlay(overlay);
            }
          },
        });
    }
  }
}
