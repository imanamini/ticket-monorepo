import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ICrowdDocument } from '../../features/crowds/data-access/models';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  downloadFile(filePath: string, fileName: string, doc?: ICrowdDocument) {
    if (this.isNativePlatform()) {
      this.downloadFileNative(filePath, fileName, doc);
    } else {
      this.downloadFileWeb(filePath, fileName, doc);
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  private isNativePlatform(): boolean {
    return isPlatformBrowser(this.platformId) ? false : true;
  }

  private downloadFileWeb(filePath: string, fileName: string, doc?: ICrowdDocument) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.setAttribute('download', fileName);
        anchor.setAttribute('rel', 'noopener noreferrer');
        anchor.setAttribute('target', '_blank');
        anchor.click();
        document.body.removeChild(anchor);
        doc['downloading'] = false;
      })
      .catch((error) => {
        doc['downloading'] = false;
      });
  }

  private downloadFileNative(filePath: string, fileName: string, doc?: ICrowdDocument) {
    const fileTransfer = new (window as any).FileTransfer();
    const uri = encodeURI(filePath);
    const fileURL = (window as any).cordova.file.externalRootDirectory + fileName;

    fileTransfer.download(
      uri,
      fileURL,
      (entry) => {
        if (doc) {
          doc['downloading'] = false;
        }
      },
      (error) => {
        if (doc) {
          doc['downloading'] = false;
        }
      },
      false,
      {},
    );
  }
}
