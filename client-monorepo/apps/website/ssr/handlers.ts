import { environment } from '../src/environments/environment';
import axios from 'axios';

export const checkPageExistence = (req: any) => {
  return new Promise<{
    code: number;
    destinationUrl?: string;
  }>((resolve, reject) => {
    // read the URL
    const originalPath = new URL(req.url, 'http://localhost').pathname;
    let path = req.url;
    // home page
    if (path && path === '/') {
      resolve({
        code: 200,
      });
      return;
    }

    // replace leading and trailing slashes
    if (path && path[0] === '/') {
      path = path.substring(1);
    }
    if (path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }

    if (path === 'daily') {
      resolve({
        code: 200,
      });
      return;
    }

    if (path === 'mag') {
      resolve({
        code: 200,
      });
      return;
    }

    // split the path to find slug and prefix
    const parts = getLastNSegmentsOfPath(5, path);
    let slug = '';
    let prefix = '';
    let catSlug = '';
    let catId = '';
    let archivePage = '';

    if (parts.length > 1) {
      prefix = parts[0];
      slug = parts[1];
    } else {
      prefix = 'p';
      slug = parts[0];
    }

    const API_PATHS = {
      DAILY: environment.api.host + environment.api.prefix + '/website/post?slug={SLUG}',
      PAGE: environment.api.host + environment.api.prefix + '/website/page/{PREFIX}/{SLUG}',
      CATEGORY: environment.api.host + environment.api.prefix + '/website/posts?category={CAT-SLUG}&perPage=20',
      POST: environment.api.host + environment.api.prefix + '/website/post?slug={SLUG}',
      ARCHIVE: environment.api.host + environment.api.prefix + '/website/posts/archive?categoryId={CAT-ID}&page={ARCHIVE_PAGE}&perPage=10',
    };

    let apiPath = API_PATHS.PAGE;
    if (prefix === 'daily' || prefix === 'mag') {
      apiPath = API_PATHS.DAILY;
    }

    // blog mag
    if (parts[0] === 'mag') {
      prefix = 'mag';
      if (parts[1] === 'archive') {
        apiPath = API_PATHS.ARCHIVE;
        if (parts.length >= 2) {
          catId = parts[parts.length - 1].slice(parts[parts.length - 1].search('categoryId') + 11, 36);
          if (parts.length > 3) {
            archivePage = parts[parts.indexOf('page') + 1];
          } else {
            archivePage = '1';
          }
        }
      } else {
        switch (parts.length) {
          case 2:
            catSlug = parts[1];
            apiPath = API_PATHS.CATEGORY;
            break;
          case 3:
            catSlug = parts[1];
            slug = parts[2];
            apiPath = API_PATHS.POST;
            break;
        }
      }
    }

    // replace SLUG and PREFIX in URLs
    apiPath = apiPath.replace('{CAT-SLUG}', catSlug);
    apiPath = apiPath.replace('{SLUG}', slug);
    apiPath = apiPath.replace('{PREFIX}', prefix);
    apiPath = apiPath.replace('{CAT-ID}', catId);
    apiPath = apiPath.replace('{ARCHIVE_PAGE}', archivePage);

    const checkPage = () => {
      checkPageApi(apiPath)
        .then((result) => {
          resolve(result);
        })
        .catch((e) => {
          reject(e);
        });
    };

    checkRedirection(originalPath)
      .then((result) => {
        if (result.url) {
          resolve({
            code: result.code,
            destinationUrl: result.url,
          });
        } else {
          checkPage();
        }
      })
      .catch((e) => {
        checkPage();
      });
  });
};

const checkPageApi = (apiPath: string) => {
  return new Promise<{
    code: number;
  }>((resolve, reject) => {
    axios
      .get(apiPath, {
        adapter: 'http',
        responseType: 'json',
      })
      .then((res) => {
        resolve({
          code: 200,
        });
      })
      .catch((e) => {
        const code = e.response.status;
        reject({
          code: 404,
        });
      });
  });
};

const checkRedirection = (path: string) => {
  return new Promise<{
    code: number;
    url: string;
  }>((resolve1, reject1) => {
    const url = environment.api.host + environment.api.prefix + '/website/redirection/check';

    axios
      .post(
        url,
        {
          path,
        },
        {
          method: 'POST',
          adapter: 'http',
          responseType: 'json',
        },
      )
      .then((res) => {
        resolve1({
          code: +res.data.statusCode,
          url: res.data.redirectTo,
        });
      })
      .catch((e) => {
        const code = e.response.status;
        reject1({
          code,
        });
      });
  });
};

const getLastNSegmentsOfPath = (n: number, url: string) => {
  const urlSegmentsArray = url.split('/');
  return urlSegmentsArray.slice(-n);
};
