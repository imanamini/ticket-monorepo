/**
 * Searches the given string for array of keywords and
 * puts them inside of a strong tag
 *
 * @param baseText
 * @param keywords
 */
export function makeKeywordsBold(baseText: string, keywords: Array<string>): any {
  keywords.forEach((keyword) => {
    if (keyword.length > 0) {
      const pattern = new RegExp('(' + keyword + ')', 'igm');
      baseText = baseText.replace(pattern, '<strong>$1</strong>');
    }
  });

  return baseText;
}
