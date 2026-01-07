const priceFormat = (numberToFormat: any, separator = '٬', removeLeadingZeros = false) => {
  if (typeof numberToFormat !== 'string') {
    numberToFormat = parseInt(numberToFormat, 10);
  }
  if (numberToFormat !== '' && removeLeadingZeros) {
    numberToFormat = parseInt(String(numberToFormat).replace(/^0*/, ''), 10);
  }
  return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export function fixWebViewHtml(html:any) {
  return html.replace('</head>', `<style>.row{margin-top: 20px !important;}</style></head>`);
}

export const cellNumberFormatter = (cellNumber: string): string => {
  return cellNumber.replace('+98', '0').replace('98', '0').replace(/ /g, '');
};

/**
 * Searches the given string for array of keywords and
 * puts them inside of a strong tag
 *
 * @param baseText
 * @param keywords
 */
export function
makeKeywordsBold(baseText: string, keywords: Array<string>) {
  keywords.forEach(keyword => {
    if (keyword.length > 0) {
      const pattern = new RegExp('(' + keyword + ')', 'igm');
      baseText = baseText.replace(pattern, '<strong>$1</strong>');
    }
  });

  return baseText;
}

function stringHasKeyword(baseString: string, keyword: string, sensitive: boolean, place?: 'START' | 'END'): boolean {
  let isValid = false;
  baseString = sensitive ? baseString : baseString.toUpperCase();
  keyword = sensitive ? keyword : keyword.toUpperCase();
  switch (place) {
    case 'START':
      isValid = baseString.startsWith(keyword);
      break;
    case 'END':
      isValid = baseString.endsWith(keyword);
      break;
    default:
      isValid = baseString.includes(keyword);
      break;
  }
  return isValid;
}

export {
  priceFormat,
  stringHasKeyword
};
