import {TgsTicketInfoResponse} from '../../api/models/tgs-ticket-info.response';

// @ts-ignore
export const FAKE_TICKET_INFO: TgsTicketInfoResponse = {
  "result": {
  "title": "SUCCESS",
    "status": 0,
    "message": "عملیات با موفقیت انجام شد",
    "level": "INFO"
},
  "providerId": "nj96ifrm4sgecg4s9gi1mo",
  "fallbackUrl": "http://localhost:4200",
  "type": 11,
  "amount": 1000,
  "ttl": 893743,
  "features": [
  {
    "title": "خرید اقساطی",
    "description": "پرداخت با اعتبار دیجی‌پی",
    "icon": "credit-pay-feature-icon",
    "selectedIcon": "credit-pay-feature-selected-icon",
    "selectedColor": "#0040ff",
    "name": 3,
    "status": "0",
    "visible": true,
    "order": 2,
    "protectionState": 2,
    "transactionType": 17,
    "isPreferredGateway": false
  },
  {
    "title": "کیف پول دیجی‌پی",
    "description": "171,900 ریال",
    "icon": "wallet-pay-feature-icon",
    "selectedIcon": "wallet-pay-feature-selected-icon",
    "selectedColor": "#0040ff",
    "name": 0,
    "status": "0",
    "visible": true,
    "order": 5,
    "protectionState": 2,
    "transactionType": 1,
    "isPreferredGateway": false
  },
  {
    "title": "درگاه پرداخت اینترنتی",
    "description": "پرداخت از طریق درگاه پرداخت",
    "icon": "ipg-pay-feature-icon",
    "selectedIcon": "ipg-pay-feature-selected-icon",
    "selectedColor": "#0040ff",
    "name": 2,
    "status": "0",
    "visible": true,
    "order": 5000,
    "protectionState": 0,
    "transactionType": 1,
    "isPreferredGateway": false
  },
  {
    "title": "کردیت کارت",
    "description": "پرداخت با کارت اعتباری",
    "icon": "not-selected-uapg-icon",
    "selectedIcon": "selected-uapg-icon",
    "selectedColor": "#0040ff",
    "name": 5,
    "status": "0",
    "visible": true,
    "order": 5000,
    "protectionState": 1,
    "transactionType": 17,
    "isPreferredGateway": false
  }
]
}
