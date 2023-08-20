import {PREVIEW_TYPE} from '../order-calculation/order-calculation.models';

export function isLongType(type: PREVIEW_TYPE) {
  return type === PREVIEW_TYPE.LONG;
}
