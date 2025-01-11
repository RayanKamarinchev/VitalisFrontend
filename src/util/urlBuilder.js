export function urlBuilder(directory, params) {
  let url = directory;
  for (const key in params) {
    url += `&${key}=${params[key]}`;
  }
  return url;
}