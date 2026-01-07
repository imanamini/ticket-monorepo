import { signal, WritableSignal } from '@angular/core';

export type WalkThroughConfig = {
  background: 'lighter' | 'darker';
  steps: WritableSignal<Array<WalkThroughStep>>;
  baseZIndex: number;
  rootElementId: string;
  startRoute: string;
  routeAfterEnd?: string;
  delay: number;
};

export type WalkThroughStep = {
  id: number;
  title?: string;
  description: string;
  selectorElement: SelectorElement;
  isLast: boolean;
  isFirst: boolean;
  isActive: WritableSignal<boolean>;
  position: 'top' | 'bottom';
  specificBackground?: 'lighter' | 'darker' | undefined;
  rightPointerPosition?: number;
  pointerStickElement?: string;
  route?: string;
  scrollToAbsolutePosition?: boolean;
  scrollContainer?: SelectorElement;
  maxHeight?: string;
};

export const DefaultWalkThroughConfig: WalkThroughConfig = {
  background: 'lighter',
  baseZIndex: 2000,
  rootElementId: '',
  steps: signal([]),
  startRoute: '',
  routeAfterEnd: '',
  delay: 0,
};

type SelectorElement = {
  selector: string;
  selectorType: 'class' | 'id';
};

export type WalkthroughEvent = {
  name: 'close' | 'done' | 'next' | 'prev' | 'destroyImmediate';
  configRootElementId: string;
  activeStepId: number;
};
