import { IApi } from '@umijs/types';
import ctx from '../../context';
import getRouteConfig from '../../routes/getRouteConfig';

/**
 * plugin for generate routes
 */
export default (api: IApi) => {
  // repalce default routes with generated routes
  api.onPatchRoutesBefore(async ({ routes, parentRoute }) => {
    // only deal with the top level routes
    if (!parentRoute) {
      const result = await getRouteConfig(api, ctx.opts);

      // clear original routes
      routes.splice(0, routes.length);

      // append new routes
      routes.push(...result);
    }
  });

  // add empty component for root layout
  // TODO: move this logic into getRouteConfig and make sure tests passed
  api.modifyRoutes(routes => {
    routes.find(route => route.path === '/').component = '(props) => props.children';

    return routes;
  });

  // remove useless /index.html from exportStatic feature
  api.onPatchRoutes(({ routes, parentRoute }) => {
    if (api.config.exportStatic && parentRoute?.path === '/') {
      const rootHtmlIndex = routes.findIndex(route => route.path === '/index.html');

      routes.splice(rootHtmlIndex, 1);
    }
  });
};
