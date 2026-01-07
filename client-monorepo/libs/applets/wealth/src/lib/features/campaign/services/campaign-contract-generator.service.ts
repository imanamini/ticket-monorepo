import { inject, Injectable } from '@angular/core';
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { HttpClient } from '@angular/common/http';
import { PurchaseService } from '../../purchase/services/purchase-service.service';
import moment from 'jalali-moment';

@Injectable({
  providedIn: 'root',
})
export class CampaignContractGeneratorService {
  data: any = {};
  http = inject(HttpClient);
  purchaseService = inject(PurchaseService);
  fontFamily!: PDFFont;
  readonly fontSize = 10;

  async modifyCredit(pdfBytes: ArrayBuffer): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page1 = pdfDoc.getPage(0);
    await this.getFont(pdfDoc);

    this.setFields([
      {
        value: this.data.firstName + ' ' + this.data.lastName,
        x: 110,
        y: 473,
        page: page1,
      },
      {
        value: this.data.fatherName,
        x: 270,
        y: 450,
        page: page1,
      },
      {
        value: this.data.birthCertNumber,
        x: 105,
        y: 428,
        page: page1,
      },
      {
        value: this.data.nationalId,
        x: 270,
        y: 428,
        page: page1,
      },
      {
        value: this.data.cellNumber,
        x: 87,
        y: 406,
        page: page1,
      },
      {
        value: this.data.phoneNumber,
        x: 280,
        y: 406,
        page: page1,
      },
      {
        value: this.data.email,
        x: 305,
        y: 383,
        page: page1,
      },
      {
        value: this.data.bankName + ' ' + this.data.bankBranch,
        x: 95,
        y: 361,
        page: page1,
      },
      {
        value: this.data.accountNumber,
        x: 315,
        y: 360,
        page: page1,
      },
      {
        value: this.data.address + ' ' + this.data.postalCode,
        x: 125,
        y: 340,
        page: page1,
      },
    ]);

    if (this.data.signature) {
      try {
        const signatureImage = await this.validateImage(pdfDoc);
        for (let index = 0; index < 6; index++) {
          pdfDoc.getPage(index).drawImage(signatureImage, {
            x: 320,
            y: 25,
            width: 120,
            height: 50,
          });
        }
      } catch (error) {
        // Signature image could not be embedded
        console.error('Error embedding signature image:', error);
      }
    }

    return await pdfDoc.save();
  }

  async modifyCustomerAndBroker(pdfBytes: ArrayBuffer): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page1 = pdfDoc.getPage(0);
    const page7 = pdfDoc.getPage(6);
    const page9 = pdfDoc.getPage(8);
    await this.getFont(pdfDoc);

    this.setFields([
      {
        value: this.data.firstName + ' ' + this.data.lastName,
        x: 140,
        y: 477,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.fatherName,
        x: 355,
        y: 477,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.nationalId,
        x: 110,
        y: 455,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.birthCertNumber,
        x: 380,
        y: 455,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.phoneNumber,
        x: 120,
        y: 437,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.postalCode,
        x: 365,
        y: 437,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.cellNumber,
        x: 125,
        y: 420,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.email,
        x: 383,
        y: 420,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.accountNumber,
        x: 145,
        y: 402,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.bankName + ' ' + this.data.bankBranch,
        x: 390,
        y: 403,
        fontSize: 9,
        page: page1,
      },
      {
        value: this.data.address + ' ' + this.data.postalCode,
        x: 50,
        y: 384,
        fontSize: 8,
        page: page1,
      },
      {
        value: this.data.firstName + ' ' + this.data.lastName,
        x: 115,
        y: 614,
        fontSize: 7,
        page: page7,
      },
      {
        value: this.data.firstName + ' ' + this.data.lastName,
        x: 153,
        y: 250,
        fontSize: 7,
        page: page9,
      },
    ]);

    if (this.data.signature) {
      try {
        const signatureImage = await this.validateImage(pdfDoc);
        for (let index = 0; index < 9; index++) {
          pdfDoc.getPage(index).drawImage(signatureImage, {
            x: 340,
            y: 25,
            width: 120,
            height: 50,
          });
        }
      } catch (error) {
        // Signature image could not be embedded
        console.error('Error embedding signature image:', error);
      }
    }

    return await pdfDoc.save();
  }

  async modifyBuyAndSell(pdfBytes: ArrayBuffer): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page1 = pdfDoc.getPage(0);
    const page2 = pdfDoc.getPage(1);
    await this.getFont(pdfDoc);

    this.setFields([
      {
        value: this.data.firstName,
        x: 90,
        y: 658,
        page: page1,
      },
      {
        value: this.data.lastName,
        x: 115,
        y: 636,
        page: page1,
      },
      {
        value: this.data.fatherName,
        x: 95,
        y: 616,
        page: page1,
      },
      {
        value: this.data.birthCertNumber,
        x: 237,
        y: 605,
        page: page1,
      },
      {
        value: this.data.birtDate,
        x: 508,
        y: 607,
        page: page1,
      },
      {
        value: this.data.birtPlace,
        x: 365,
        y: 605,
        page: page1,
      },
      {
        value: this.data.address,
        x: 25,
        y: 565,
        fontSize: 8,
        page: page1,
      },
      {
        value: this.data.birthCertificationId,
        x: 485,
        y: 582,
        page: page1,
      },
      {
        value: this.data.nationalId,
        x: 450,
        y: 555,
        page: page1,
      },
      {
        value: this.data.email,
        x: 110,
        y: 534,
        fontSize: 8,
        page: page1,
      },
      {
        value: this.data.postalCode,
        x: 350,
        y: 534,
        fontSize: 8,
        page: page1,
      },
      {
        value: this.data.phoneNumber,
        x: 110,
        y: 514,
        page: page1,
      },
      {
        value: this.data.cellNumber,
        x: 370,
        y: 514,
        page: page1,
      },
      {
        value: this.data.accountNumber,
        x: 133,
        y: 492,
        page: page1,
      },
      {
        value: this.data.shabaNumber,
        x: 410,
        y: 492,
        page: page1,
      },
      {
        value: this.data.bankName,
        x: 100,
        y: 470,
        page: page1,
      },
      {
        value: this.data.bankBranch,
        x: 370,
        y: 470,
        page: page1,
      },
      {
        value: this.data.bankBranchCode,
        x: 490,
        y: 470,
        page: page1,
      },
      {
        value: this.data.accountNumber,
        x: 145,
        y: 712,
        fontSize: 8,
        page: page2,
      },
      {
        value: this.data.bankBranch,
        x: 230,
        y: 713,
        fontSize: 6,
        page: page2,
      },
      {
        value: this.data.bankName,
        x: 280,
        y: 713,
        fontSize: 5,
        page: page2,
      },
    ]);
    if (this.data.signature) {
      try {
        const signatureImage = await this.validateImage(pdfDoc);
        for (let index = 0; index < 2; index++) {
          pdfDoc.getPage(index).drawImage(signatureImage, {
            x: 405,
            y: 20,
            width: 120,
            height: 50,
          });
        }
      } catch (error) {
        // Signature image could not be embedded
        console.error('Error embedding signature image:', error);
      }
    }

    return await pdfDoc.save();
  }

  async modifyRiskStatement(pdfBytes: ArrayBuffer): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page1 = pdfDoc.getPage(0);
    const page3 = pdfDoc.getPage(2);
    const page8 = pdfDoc.getPage(7);
    const today = moment(new Date()).locale('fa');
    await this.getFont(pdfDoc);

    this.setFields([
      {
        value: this.data.firstName + ' ' + this.data.lastName,
        x: 192,
        y: 353,
        page: page1,
      },

      {
        value: this.data.fatherName,
        x: 152,
        y: 306,
        page: page1,
      },
      {
        value: this.data.birthDate,
        x: 430,
        y: 306,
        page: page1,
      },
      {
        value: this.data.birtPlace,
        x: 160,
        y: 282,
        page: page1,
      },
      {
        value: this.data.nationalId,
        x: 370,
        y: 282,
        page: page1,
      },
      {
        value: this.data.birthCertNumber,
        x: 185,
        y: 260,
        page: page1,
      },
      {
        value: this.data.birthCertificationId,
        x: 210,
        y: 236,
        page: page1,
      },
      {
        value: this.data.phoneNumber,
        x: 440,
        y: 236,
        page: page1,
      },
      {
        value: this.data.cellNumber,
        x: 407,
        y: 214,
        page: page1,
      },
      {
        value: this.data.bankName + ' ' + this.data.bankBranchCode,
        x: 175,
        y: 190,
        page: page1,
      },
      {
        value: this.data.accountNumber,
        x: 410,
        y: 190,
        page: page1,
      },
      {
        value: this.data.email,
        x: 210,
        y: 165,
        page: page1,
      },
      {
        value: this.data.address,
        x: 135,
        y: 144,
        fontSize: 8,
        page: page1,
      },
      {
        value: this.data.postalCode,
        x: 210,
        y: 120,
        page: page1,
      },
      {
        value: today.format('YYYY MM DD').toString(),
        x: 185,
        y: 588,
        fontSize: 13,
        page: page3,
      },
      {
        value: today.format('YYYY/MM/DD').toString(),
        x: 110,
        y: 465,
        fontSize: 14,
        page: page8,
      },
    ]);
    if (this.data.signature) {
      try {
        const signatureImage = await this.validateImage(pdfDoc);
        page8.drawImage(signatureImage, {
          x: 370,
          y: 210,
          width: 120,
          height: 50,
        });
      } catch (error) {
        console.error('Error embedding signature image:', error);
      }
    }

    return await pdfDoc.save();
  }

  async getContracts(data: any): Promise<{
    creditContract: Blob;
    customerAndBrokerContract: Blob;
    buyAndSellContract: Blob;
    seke2AssuranceFundContract: Blob;
    iMEUnderWritingRiskStatementContract: Blob;
  }> {
    const pdfPath = 'wealth-assets/pdf';
    const pdfNames = [
      'credit',
      'customerAndBroker',
      'buyAndSell',
      'seke2AssuranceFund',
      'iMEUnderWritingRiskStatement',
      'generalContract',
    ] as const;
    type PdfBytesFiles = Record<(typeof pdfNames)[number], ArrayBuffer>;
    const pdfFileNames = pdfNames.map((name) => `${pdfPath}/${name}.pdf`);
    this.data = data;

    const pdfsBytesFiles: PdfBytesFiles = await Promise.allSettled(
      pdfFileNames.map((file) => fetch(file).then((res) => res.arrayBuffer())),
    ).then((results) => {
      return results.reduce((acc: PdfBytesFiles, result, index) => {
        if (result.status === 'fulfilled') {
          acc[pdfNames[index]] = result.value;
        } else {
          console.log(`Failed to fetch PDF: ${pdfFileNames[index]}`, result.reason);
        }
        return acc;
      }, {} as PdfBytesFiles);
    });

    const creditContract = await this.modifyCredit(pdfsBytesFiles.credit);
    const customerAndBrokerContract = await this.modifyCustomerAndBroker(pdfsBytesFiles.customerAndBroker);
    const buyAndSellContract = await this.modifyBuyAndSell(pdfsBytesFiles.buyAndSell);
    const riskStatementContract = await this.modifyRiskStatement(pdfsBytesFiles.iMEUnderWritingRiskStatement);

    const contract = new Blob([creditContract.slice(0)], { type: 'application/pdf' });
    const customer = new Blob([customerAndBrokerContract.slice(0)], {
      type: 'application/pdf',
    });
    const buyAndSell = new Blob([buyAndSellContract.slice(0)], {
      type: 'application/pdf',
    });
    const seke2AssuranceFund = new Blob([pdfsBytesFiles.seke2AssuranceFund], {
      type: 'application/pdf',
    });
    const riskStatement = new Blob([riskStatementContract.slice(0)], {
      type: 'application/pdf',
    });

    return {
      creditContract: contract,
      customerAndBrokerContract: customer,
      buyAndSellContract: buyAndSell,
      seke2AssuranceFundContract: seke2AssuranceFund,
      iMEUnderWritingRiskStatementContract: riskStatement,
    };
  }

  async getFont(pdfDoc) {
    pdfDoc.registerFontkit(fontkit);
    const fontUrl = 'wealth-assets/fonts/iran-yekan/ttf/iranyekanwebmediumfanum.ttf';
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);
    this.fontFamily = font;
    return font;
  }

  setX(offsetX, text, pageWidth) {
    const textWidth = this.fontFamily.widthOfTextAtSize(text, this.fontSize);
    return pageWidth - offsetX - textWidth;
  }

  setFields(
    fields: {
      value: string | null;
      x: number;
      y: number;
      page: PDFPage;
      fontSize?: number;
    }[],
  ) {
    fields.forEach((field) => {
      const val = field.value || '';
      field.page.drawText(val, {
        x: this.setX(field.x, val, field.page.getWidth()),
        y: field.y,
        size: field.fontSize || this.fontSize,
        font: this.fontFamily,
        color: rgb(0, 0, 0),
      });
    });
  }

  async validateImage(pdfDoc) {
    try {
      return await pdfDoc.embedPng(this.data.signature);
    } catch (err) {
      try {
        return await pdfDoc.embedJpg(this.data.signature);
      } catch (error) {
        // Image format not supported
        throw new Error('Invalid image format for signature.');
      }
    }
  }
}
