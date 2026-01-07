import { Injectable } from '@angular/core';
import packageJson from '../../../../../project.json';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  public appVersion = packageJson['version'];
}
