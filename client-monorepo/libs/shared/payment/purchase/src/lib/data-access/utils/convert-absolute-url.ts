/**
 * Convert the given absolute URL to a relative URL
 *
 * Sometimes URL is an absolute full url (like http://api.mydigipay.com/digipay/api/what/ever)
 * and we need to convert it to a relative URL, in this case we can use this helper method.
 *
 * @param fullAbsoluteUrl
 */
export const convertToRelativeUrl = (fullAbsoluteUrl: string) => {
  return fullAbsoluteUrl.substr(fullAbsoluteUrl.lastIndexOf('/api') + 5);
};
