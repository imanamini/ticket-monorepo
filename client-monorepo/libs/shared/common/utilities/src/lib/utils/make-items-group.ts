import { ItemInSlider } from '@client-monorepo/common/ui-components';

export function makeItemsGroup(items: ItemInSlider[], itemPerSlide = 12): Array<ItemInSlider[]> {
  const tempArrayItems: Array<ItemInSlider[]> = [];
  let mustBreak = false;
  for (let slide = 0; slide < items.length; slide++) {
    if (mustBreak) {
      break;
    }
    for (let slideItem = 0; slideItem < itemPerSlide; slideItem++) {
      const store = items[slide * itemPerSlide + slideItem];
      if (!store) {
        mustBreak = true;
        break;
      } else {
        if (!tempArrayItems[slide]) {
          tempArrayItems[slide] = [];
        }
        tempArrayItems[slide].push(store);
      }
    }
  }
  return tempArrayItems;
}
