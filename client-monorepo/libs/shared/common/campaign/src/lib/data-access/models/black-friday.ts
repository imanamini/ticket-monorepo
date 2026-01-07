import { CampaignConfig } from './campaign-config';

export const BlackFridayConfig: CampaignConfig = {
  name: 'black-friday',
  startDate: 1763756700 * 1000,
  endDate: 1764620999 * 1000,
  assetScript:
    '{  "count": 9,  "size": {    "min": 401,    "max": 800,    "pulse": 0  },  "speed": {    "x": {      "min": 0,      "max": 0.4    },    "y": {      "min": 0,      "max": 0.4    }  },  "colors": {    "background": "#0b0c10",    "particles": [      "#1e6cff",      "#1b1d27",      "#242c36",      "#272b39"    ]  },  "blending": "overlay",  "opacity": {    "center": 0.2,    "edge": 0.00  },  "skew": 0,  "shapes": [    "c"  ]}',
  banner: {
    image: 'assets/stores/black-friday.png',
    title: {
      text: 'بلک فرایدی',
      class: 'st-1',
    },
    subtitle: {
      text: 'تخفیف‌های استثنایی روی دسته‌بندی‌ها',
      class: 'b-3',
    },
    textBackground: 'linear-gradient(265deg, #8893A1 -14.32%, #000 103.42%)',
  },
  assetsPrefix: 'black-friday/',
  promotionsBackgroundImage: 'url("assets/promotions/black-friday-bg.svg")',
};
