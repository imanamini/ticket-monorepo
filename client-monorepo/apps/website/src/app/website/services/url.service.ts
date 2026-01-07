import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from "../../../environments/environment";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  host = environment.api.host;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
  }

  handleLink(link: string) {
    if (isPlatformBrowser(this.platformId) && link) {
      if (link.startsWith('http')) {
        window.location.href = link;
      } else {
        window.location.href = `${this.host}${link}`
      }
    }
  }
}
