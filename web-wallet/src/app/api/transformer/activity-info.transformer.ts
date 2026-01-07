export const activityInfoTransformer = (activityInfoObject) => {
  if (Object.keys(activityInfoObject).length > 0) {
    const items = [];
    Object.keys(activityInfoObject).forEach((numericIndex) => {
      const obj = activityInfoObject[numericIndex];
      const label = Object.keys(obj)[0];
      items.push({
        key: label,
        value: obj[label],
      });
    });
    return items;
  }

  return [];
};
