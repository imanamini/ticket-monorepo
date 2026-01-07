export class PlateUtils {
  static convertCarToText(plate: string): string {
    let newPlate = plate.slice(0, 2) + ' ';
    switch (plate.slice(2, 4)) {
      case '01':
        newPlate = ' الف ' + newPlate;
        break;

      case '02':
        newPlate = ' ب ' + newPlate;
        break;

      case '03':
        newPlate = ' پ ' + newPlate;
        break;

      case '04':
        newPlate = ' ت ' + newPlate;
        break;

      case '05':
        newPlate = ' ث ' + newPlate;
        break;

      case '06':
        newPlate = ' ج ' + newPlate;
        break;

      case '10':
        newPlate = ' د ' + newPlate;
        break;

      case '13':
        newPlate = ' ز ' + newPlate;
        break;

      case '15':
        newPlate = ' س ' + newPlate;
        break;

      case '16':
        newPlate = ' ش ' + newPlate;
        break;

      case '17':
        newPlate = ' ص ' + newPlate;
        break;

      case '19':
        newPlate = ' ط ' + newPlate;
        break;

      case '21':
        newPlate = ' ع ' + newPlate;
        break;

      case '23':
        newPlate = ' ف ' + newPlate;
        break;

      case '24':
        newPlate = ' ق ' + newPlate;
        break;

      case '25':
        newPlate = ' ک ' + newPlate;
        break;

      case '26':
        newPlate = ' گ ' + newPlate;
        break;

      case '27':
        newPlate = ' ل ' + newPlate;
        break;

      case '28':
        newPlate = ' م ' + newPlate;
        break;

      case '29':
        newPlate = ' ن ' + newPlate;
        break;

      case '30':
        newPlate = ' و ' + newPlate;
        break;

      case '31':
        newPlate = ' ه ' + newPlate;
        break;

      case '32':
        newPlate = ' ي ' + newPlate;
        break;

      case '33':
        newPlate = ' معلولین ' + newPlate;
        break;

      case '54':
        newPlate = ' D ' + newPlate;
        break;

      case '69':
        newPlate = ' S ' + newPlate;
        break;
    }

    newPlate = 'ایران ' + plate.slice(7, 9) + ' - ' + plate.slice(4, 7) + newPlate;

    return newPlate;
  }

  static convertMotorToText(plate: string): string {
    return 'ایران ' + plate.slice(3) + '-' + plate.slice(0, 3);
  }

}
