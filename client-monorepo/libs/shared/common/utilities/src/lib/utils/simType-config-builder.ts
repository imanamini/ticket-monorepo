import { CellNumberType } from '@client-monorepo/daily-fintech/recommendation';
import { SimTypeConfig } from '@client-monorepo/common/utilities';

const DEFAULT_ICON_COLOR = '#0F53ED';

export function buildSimTypeConfig(
  types: CellNumberType[],
  valueMapper: Record<CellNumberType, string>,
  iconMapper: Record<CellNumberType, string>,
  iconColor: string = DEFAULT_ICON_COLOR,
): SimTypeConfig[] {
  return types.map((type) => ({
    key: type.toString(),
    value: valueMapper[type],
    icon: iconMapper[type],
    iconColor: iconColor,
  }));
}
