import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  getBodyTag(content: string): string {
    const startIndexOfBody = content.indexOf('<body');
    const endIndexOfBody = content.indexOf('</body>');
    return content.substring(startIndexOfBody + 6, endIndexOfBody);
  }
}
