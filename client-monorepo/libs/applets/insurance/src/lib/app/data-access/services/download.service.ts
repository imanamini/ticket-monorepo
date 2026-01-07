import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class DownloadService {

  async download(file: File | Blob, type: string, fileName: string): Promise<void> {
    const blob = new Blob([file], {type});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 3000);
  }

  private getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  }
}
