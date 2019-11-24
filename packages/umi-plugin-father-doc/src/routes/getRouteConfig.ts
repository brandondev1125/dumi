import fs from 'fs';
import path from 'path';
import { IApi, IRoute } from 'umi-types';
import getFrontMatter from './getFrontMatter';
import getRouteConfigFromDir from './getRouteConfigFromDir';
import { IFatherDocOpts } from '../index';

export default (paths: IApi['paths'], opts: IFatherDocOpts): IRoute[] => {
  const config = [{
    path: '/',
    component: path.join(__dirname, '../themes/default/layout.js'),
    routes: [],
  }];

  if (opts.routes) {
    // only apply user's routes if there has routes config
    config[0].routes = opts.routes.map(({ component, ...routeOpts }) => ({
      component: (
        path.isAbsolute(component as string)
          ? component
          : path.join(paths.absPagesPath, component as string)
      ),
      ...routeOpts,
    }));
  } else {
    // generate routes automatically if there has no routes config

    // find routes from include path
    opts.include.forEach((item) => {
      const docsPath = path.isAbsolute(item) ? item : path.join(paths.cwd, item);

      if (fs.existsSync(docsPath) && fs.statSync(docsPath).isDirectory()) {
        config[0].routes.push(...getRouteConfigFromDir(docsPath));
      }
    });

    // find routes from source path
    config[0].routes.push(...getRouteConfigFromDir(paths.absPagesPath));
  }

  // read yaml config for all routes
  config[0].routes.forEach((route) => {
    route.meta = getFrontMatter(route.component as string);
  });

  return config;
}
