/* Only accepts numbers in English, Persian and Arabic **/
export const OnlyEnFaArNumbersPattern = '^[\\d\u0660-\u0669\u06F0-\u06F9\uFF10-\uFF19]+$';

/* Only accepts characters and white space for name fields **/
export const NamePattern = '^[^\\p{P}\\p{S}]+$';

/* Only Phone Number with Persian, Arabic and English numbers **/
export const PhoneNumberPattern = '^(?:09|۰۹)(?:[۰-۹0-9]){9}$';

/* Only for voucher code validation **/
export const VoucherCodePattern = '^[a-zA-Z0-9۰-۹_-]*$';
export const ImeiPattern = /\b\d{15}\b/; // Regex to match 15-digit IMEI numbers

export const FaEnNumberTextPattern = '^[A-Za-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0660-\u0669 ]+$';
