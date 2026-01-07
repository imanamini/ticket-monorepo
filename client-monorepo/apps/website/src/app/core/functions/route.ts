/**
 * Generates route path for the given service name
 *
 * @param serviceName
 * @param prefix
 * @param relativePath
 */
export function getServicePath(serviceName, prefix = '/', relativePath = '') {
  return prefix + 'service/' + serviceName + relativePath;
}

/**
 * Generates route path for the pages
 *
 * @param pageName
 * @param prefix
 * @param relativePath
 */
export function getPagePath(pageName, prefix = '/', relativePath = '') {
  return prefix + 'page/' + pageName + relativePath;
}
