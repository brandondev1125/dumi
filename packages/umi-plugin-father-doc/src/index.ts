import path from 'path';
import { IApi } from 'umi-types';
import getRouteConfig from './routes/getRouteConfig';
import getMenuFromRoutes from'./routes/getMenuFromRoutes';

export default function (api: IApi) {
  const routeConfig = getRouteConfig(api.paths);

  api.registerPlugin({
    id: require.resolve('umi-plugin-react'),
    apply: require('umi-plugin-react').default,
    opts: { title: 'father-doc' },
  });

  api.modifyRoutes((routes) => {
    const result = routeConfig;
    const childRoutes = result[0].routes;

    // insert TitleWrapper for routes
    childRoutes.forEach((item) => {
      // see also: https://github.com/umijs/umi/blob/master/packages/umi-plugin-react/src/plugins/title/index.js#L37
      if (!item.routes || !item.routes.length) {
        item.Routes = [
          ...(item.Routes || []),
          path.relative(api.paths.cwd, path.join(api.paths.absTmpDirPath, './TitleWrapper.jsx')),
        ];
      }
    });

    // append umi NotFound component to routes
    childRoutes.push(...routes.filter(({ path }) => !path));

    return result;
  });

  // exclude .md file for url-loader
  api.modifyDefaultConfig(config => ({
    ...config,
    urlLoaderExcludes: [/\.md$/],
  }));

  // configure loader for .md file
  api.chainWebpackConfig(config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('father-doc')
      .loader(require.resolve('./loader'));
  });

  // pass menu props for layout component
  api.modifyRouteComponent((module, { component }) => {
    let ret = module;

    if (/\/layout\.[tj]sx?$/.test(component)) {
      ret = `props => React.createElement(${
        module
      }, { menu: { items: ${
        JSON.stringify(getMenuFromRoutes(routeConfig[0].routes)).replace(/\"/g, '\'')
      } }, ...props })`;
    }

    return ret;
  });
}
