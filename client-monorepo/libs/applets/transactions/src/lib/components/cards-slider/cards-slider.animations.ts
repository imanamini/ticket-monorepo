import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { DefaultTransitionFunctionConst } from '@client-monorepo/common/ui-components';

const fastTiming = '0.35s ' + DefaultTransitionFunctionConst;
const collapseTime = '0.5s ' + DefaultTransitionFunctionConst;
const newTiming = '0.25s linear';

const voidStyle = {
  transform: 'translate(-50%, -150%) rotate(43deg) scale(0)',
  filter: 'blur(40px)',
  opacity: '0',
  zIndex: 10,
};

const o2Style = {
  transform: 'translate(-50%, -50%) rotate(15.48deg)',
  opacity: '1',
  filter: 'blur(1px)',
  zIndex: 11,
};

const o1Style = {
  transform: 'translate(-50%, -50%) rotate(7.74deg)',
  opacity: '1',
  filter: 'blur(1px)',
  zIndex: 12,
};

const o0Style = {
  transform: 'translate(-50%, -50%) rotate(0deg)',
  opacity: '1',
  filter: 'blur(0px)',
  zIndex: 13,
};

const o2Collapsed = {
  transform: 'translate(-50%, -50%) rotate(0deg)',
  opacity: '0',
  filter: 'blur(1px)',
  zIndex: 11,
};

const o1Collapsed = {
  transform: 'translate(-50%, -50%) rotate(0deg)',
  opacity: '0',
  filter: 'blur(1px)',
  zIndex: 12,
};

const o0Collapsed = {
  transform: 'translate(-50%, -50%) rotate(0deg)',
  opacity: '1',
  filter: 'blur(0px)',
  zIndex: 13,
};

const frontFadeStyle = {
  transform: 'translate(-40%, -40%) rotate(0deg) scale(1.3)',
  opacity: '0',
  filter: 'blur(10px)',
  zIndex: 20,
};

export const cardsSliderAnimations = [
  trigger('cards', [
    state('void', style(voidStyle)),
    state('collapsed-0', style(o0Collapsed)),
    state('collapsed-1', style(o1Collapsed)),
    state('collapsed-2', style(o2Collapsed)),
    state('2', style(o2Style)),
    state('1', style(o1Style)),
    state('0', style(o0Style)),
    transition('collapsed-0 <=> 0', [animate(collapseTime)]),
    transition('collapsed-1 <=> 1', [animate(collapseTime)]),
    transition('collapsed-2 <=> 2', [animate(collapseTime)]),
    transition('2 => 1', [animate(fastTiming)]), //forward transitions
    transition('1 => 0', [animate(fastTiming)]),
    transition('void => 2', [animate(fastTiming)]),
    transition('void => 1', [animate(fastTiming)]),
    transition('0 => void', [animate(newTiming, keyframes([style({ ...frontFadeStyle, offset: 1 })]))]),
    transition('0 => 1', [animate(fastTiming)]), //backward transitions
    transition('1 => 2', [animate(fastTiming)]),
    transition('2 => void', [animate(fastTiming)]),
    transition('void => 0', [
      animate(
        fastTiming,
        keyframes([
          style({ ...frontFadeStyle, offset: 0.01 }),
          style({
            ...o0Style,
            offset: 1,
          }),
        ]),
      ),
    ]),
    transition('0 => 2', [
      animate(
        fastTiming,
        keyframes([
          style({ ...frontFadeStyle, offset: 0.5 }),
          style({ ...voidStyle, offset: 0.51 }),
          style({
            ...o2Style,
            offset: 1,
          }),
        ]),
      ),
    ]),
    transition('2 => 0', [
      animate(
        fastTiming,
        keyframes([
          style({ ...voidStyle, offset: 0.5 }),
          style({ ...frontFadeStyle, offset: 0.51 }),
          style({
            ...o0Style,
            offset: 1,
          }),
        ]),
      ),
    ]),
  ]),
];
