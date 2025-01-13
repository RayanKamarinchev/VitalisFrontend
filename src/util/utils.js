export function convertKeysToLowercase(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    let newKey = String(key).charAt(0).toLowerCase() + String(key).slice(1);
    acc[newKey] = obj[key];
    return acc;
  }, {});
}

export function urlBuilder(directory, params) {
  let url = directory;
  for (const key in params) {
    url += `&${key}=${params[key]}`;
  }
  return url;
}