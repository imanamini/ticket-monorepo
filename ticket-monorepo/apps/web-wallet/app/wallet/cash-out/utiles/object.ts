export function fixActivityInfoArray(value: object) {
  if (Object.keys(value).length > 0) {
    let result = [];
    Object.keys(value).forEach((val, i) => {
      let key = Object.keys(value[i])[0];
      let item = {};
      if (typeof value[i][key] === 'string') {
        // backward compatible pay result
        item = {
          key: key,
          value: value[i][key],
          copyable: false,
        };
      } else {
        item = {
          key: key,
          value: value[i][key].value,
          copyable: value[i][key].copyable,
        };
      }
      result.push(item);
    });
    return result;
  }

  return [];
}
