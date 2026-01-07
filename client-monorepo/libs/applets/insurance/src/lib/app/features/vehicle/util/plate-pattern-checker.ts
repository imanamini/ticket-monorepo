export const PlatePatternChecker = (plate: string) => {
  if (!plate || plate.length !== 9) {
    return false;
  }

  const isP1Valid = !plate.slice(0, 2).includes('0');
  const isP3Valid = !plate.slice(4, 7).includes('0');
  const isP4Valid = Math.floor(+plate.slice(7, 9) / 10) > 0;

  return isP1Valid && isP3Valid && isP4Valid;
};

export const MotorPlatePatternChecker = (plate: string) => {
  if (!plate || plate.length !== 8) {
    return false;
  }

  const isP1Valid = !plate.slice(0, 3).includes('0');
  const isP3Valid = !plate.slice(4, 8).includes('0');

  return isP1Valid && isP3Valid;
};
