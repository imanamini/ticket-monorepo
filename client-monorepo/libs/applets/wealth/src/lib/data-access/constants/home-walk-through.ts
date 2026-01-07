import { signal } from '@angular/core';
import { WalkThroughConfig } from '@client-monorepo/shared/common/walk-through';

export const WEALTH_HOME_WALK_THROUGH_CONFIG: WalkThroughConfig = {
  background: 'darker',
  baseZIndex: 3500,
  delay: 0,
  rootElementId: 'wealthHomeWalkThrough',
  startRoute: 'all',
  steps: signal([]),
};
