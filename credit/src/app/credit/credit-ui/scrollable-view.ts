import { isMacOs, supportsTouch } from '../../utils/device';

export class ScrollableView {
  disableCustomScroll = supportsTouch() || isMacOs();
}
