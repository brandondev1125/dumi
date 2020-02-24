import path from 'path';
import getRoute from '../getRouteConfigFromDir';
import decorateRoute from '../decorator';
import getMenu from '../getMenuFromRoutes';
import getNav from '../getNavFromRoutes';

const FIXTURES_PATH = path.join(__dirname, '..', 'fixtures');
const DEFAULT_LOCALES = [
  ['en-US', 'EN'],
  ['zh-CN', '中文'],
];

describe('routes & menu: site mode', () => {
  let routes;

  it('getRouteConfigFromDir', () => {
    routes = getRoute(path.join(FIXTURES_PATH, 'site'), {
      locales: DEFAULT_LOCALES,
    });

    expect(routes).toEqual([
      {
        path: '/api',
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/api.md',
        exact: true,
      },
      {
        path: '/',
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/index.md',
        exact: true,
      },
      {
        path: '/zh-CN',
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/index.zh-CN.md',
        exact: true,
      },
      {
        path: '/config',
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/config/index.md',
        exact: true,
      },
      {
        path: '/config/others',
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/config/others.md',
        exact: true,
      },
      {
        component: './packages/umi-plugin-dumi/src/routes/fixtures/site/rewrite/index.md',
        exact: true,
        path: '/rewrite',
      },
    ]);
  });

  it('route decorator', () => {
    routes = decorateRoute(
      routes,
      { locales: DEFAULT_LOCALES, mode: 'site' },
      {
        paths: {
          cwd: process.cwd(),
          absTmpPath: path.join(process.cwd(), '.umi'),
        },
      },
    );

    expect(routes).toEqual([
      {
        path: '/api',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/api.md',
        exact: true,
        meta: {
          slugs: [
            { depth: 1, value: 'config.a', heading: 'configa' },
            { depth: 1, value: 'config.b', heading: 'configb' },
          ],
          title: 'Api',
          nav: { path: '/api', title: 'Api' },
        },
        title: 'Api',
      },
      {
        path: '/',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/index.md',
        exact: true,
        meta: { slugs: [], title: 'Index' },
        title: 'Index',
      },
      {
        path: '/zh-CN',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/index.zh-CN.md',
        exact: true,
        meta: { slugs: [], locale: 'zh-CN', title: 'Index' },
        title: 'Index',
      },
      {
        path: '/config',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/config/index.md',
        exact: true,
        meta: {
          slugs: [],
          title: 'Index',
          nav: { path: '/config', title: 'Config' },
        },
        title: 'Index',
      },
      {
        path: '/config/others',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/config/others.md',
        exact: true,
        meta: {
          slugs: [],
          title: 'Others',
          nav: { path: '/config', title: 'Config' },
        },
        title: 'Others',
      },
      {
        path: '/test-rewrite/rewrite',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/rewrite/index.md',
        exact: true,
        meta: {
          nav: { path: '/test-rewrite', title: 'Test-rewrite' },
          slugs: [],
          title: 'Index',
          group: { path: '/test-rewrite/rewrite', title: 'Rewrite' },
        },
        title: 'Index',
      },
      {
        path: '/zh-CN/api',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/api.md',
        exact: true,
        meta: {
          slugs: [
            { depth: 1, value: 'config.a', heading: 'configa' },
            { depth: 1, value: 'config.b', heading: 'configb' },
          ],
          title: 'Api',
          nav: { path: '/zh-CN/api', title: 'Api' },
          locale: 'zh-CN',
        },
        title: 'Api',
      },
      {
        path: '/zh-CN/config',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/config/index.md',
        exact: true,
        meta: {
          slugs: [],
          title: 'Index',
          nav: { path: '/zh-CN/config', title: 'Config' },
          locale: 'zh-CN',
        },
        title: 'Index',
      },
      {
        path: '/zh-CN/config/others',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/config/others.md',
        exact: true,
        meta: {
          slugs: [],
          title: 'Others',
          nav: { path: '/zh-CN/config', title: 'Config' },
          locale: 'zh-CN',
        },
        title: 'Others',
      },
      {
        path: '/zh-CN/test-rewrite/rewrite',
        component: '../../packages/umi-plugin-dumi/src/routes/fixtures/site/rewrite/index.md',
        exact: true,
        meta: {
          nav: { path: '/zh-CN/test-rewrite', title: 'Test-rewrite' },
          slugs: [],
          title: 'Index',
          group: { path: '/zh-CN/test-rewrite/rewrite', title: 'Rewrite' },
          locale: 'zh-CN',
        },
        title: 'Index',
      },
      {
        path: '/test-rewrite',
        meta: {},
        exact: true,
        redirect: '/test-rewrite/rewrite',
      },
      {
        path: '/zh-CN/test-rewrite',
        meta: {},
        exact: true,
        redirect: '/zh-CN/test-rewrite/rewrite',
      },
    ]);
  });

  it('getNavFromRoutes', () => {
    const navs = getNav(routes, { locales: DEFAULT_LOCALES, mode: 'site' });

    expect(navs).toEqual({
      'en-US': [
        { path: '/api', title: 'Api' },
        { path: '/config', title: 'Config' },
        { path: '/test-rewrite', title: 'Test-rewrite' },
      ],
      'zh-CN': [
        { path: '/zh-CN/api', title: 'Api' },
        { path: '/zh-CN/config', title: 'Config' },
        { path: '/zh-CN/test-rewrite', title: 'Test-rewrite' },
      ],
    });
  });

  it('getMenuFromRoutes', () => {
    const menu = getMenu(routes, { locales: DEFAULT_LOCALES });

    expect(menu).toEqual({
      'en-US': {
        '/api': [
          {
            path: '/api',
            title: 'Api',
            meta: {
              slugs: [
                { depth: 1, value: 'config.a', heading: 'configa' },
                { depth: 1, value: 'config.b', heading: 'configb' },
              ],
              title: 'Api',
              nav: { path: '/api', title: 'Api' },
            },
          },
        ],
        '*': [
          {
            path: '/',
            title: 'Index',
            meta: { slugs: [], title: 'Index' },
          },
        ],
        '/config': [
          {
            path: '/config',
            title: 'Index',
            meta: {
              slugs: [],
              title: 'Index',
              nav: { path: '/config', title: 'Config' },
            },
          },
          {
            path: '/config/others',
            title: 'Others',
            meta: {
              slugs: [],
              title: 'Others',
              nav: { path: '/config', title: 'Config' },
            },
          },
        ],
        '/test-rewrite': [
          {
            title: 'Rewrite',
            path: '/test-rewrite/rewrite',
            meta: {},
            children: [
              {
                path: '/test-rewrite/rewrite',
                title: 'Index',
                meta: {
                  nav: { path: '/test-rewrite', title: 'Test-rewrite' },
                  slugs: [],
                  title: 'Index',
                  group: { path: '/test-rewrite/rewrite', title: 'Rewrite' },
                },
              },
            ],
          },
        ],
      },
      'zh-CN': {
        '*': [
          {
            path: '/zh-CN',
            title: 'Index',
            meta: { slugs: [], locale: 'zh-CN', title: 'Index' },
          },
        ],
        '/zh-CN/api': [
          {
            path: '/zh-CN/api',
            title: 'Api',
            meta: {
              slugs: [
                { depth: 1, value: 'config.a', heading: 'configa' },
                { depth: 1, value: 'config.b', heading: 'configb' },
              ],
              title: 'Api',
              nav: { path: '/zh-CN/api', title: 'Api' },
              locale: 'zh-CN',
            },
          },
        ],
        '/zh-CN/config': [
          {
            path: '/zh-CN/config',
            title: 'Index',
            meta: {
              slugs: [],
              title: 'Index',
              nav: { path: '/zh-CN/config', title: 'Config' },
              locale: 'zh-CN',
            },
          },
          {
            path: '/zh-CN/config/others',
            title: 'Others',
            meta: {
              slugs: [],
              title: 'Others',
              nav: { path: '/zh-CN/config', title: 'Config' },
              locale: 'zh-CN',
            },
          },
        ],
        '/zh-CN/test-rewrite': [
          {
            title: 'Rewrite',
            path: '/zh-CN/test-rewrite/rewrite',
            meta: {},
            children: [
              {
                path: '/zh-CN/test-rewrite/rewrite',
                title: 'Index',
                meta: {
                  nav: { path: '/zh-CN/test-rewrite', title: 'Test-rewrite' },
                  slugs: [],
                  title: 'Index',
                  group: { path: '/zh-CN/test-rewrite/rewrite', title: 'Rewrite' },
                  locale: 'zh-CN',
                },
              },
            ],
          },
        ],
      },
    });
  });
});
