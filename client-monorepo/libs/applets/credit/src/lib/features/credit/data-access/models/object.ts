type Item = {
  key: string;
  value: string;
  copyable: string | boolean;
};

export function fixActivityInfoArray(value: Record<string, any>) {
  if (Object.keys(value).length <= 0) {
    return [];
  }
  const result: Item[] = [];
  Object.keys(value).forEach((val, i) => {
    const key = Object.keys(value[i])[0];
    if (typeof key === 'undefined') {
      return;
    }
    const item: Item = {
      key: key,
      value: typeof value[i][key] === 'string' ? value[i][key] : value[i][key].value,
      copyable: typeof value[i][key] === 'string' ? false : value[i][key].copyable,
    };
    result.push(item);
  });
  return result;
}

export function isEqual(value1: any, value2: any) {
  // Check if the values are strictly equal
  if (value1 === value2) {
    return true;
  }

  // Check for null and undefined
  if (value1 == null || value2 == null) {
    return false;
  }

  // Check for different types
  if (typeof value1 !== typeof value2) {
    return false;
  }

  // If both values are arrays, compare them element by element
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }

    for (let i = 0; i < value1.length; i++) {
      if (!isEqual(value1[i], value2[i])) {
        return false;
      }
    }

    return true;
  }

  // If both values are objects, compare their keys and values
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!isEqual(value1[key], value2[key])) {
        return false;
      }
    }

    return true;
  }

  // For all other types, consider them not equal if the above checks don't apply
  return false;
}
