import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';
import { Injectable } from '@angular/core';
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: {direction: Hammer.DIRECTION_ALL},
  } as any;
}
