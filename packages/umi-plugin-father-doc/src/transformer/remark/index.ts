import unified from 'unified';
import frontmatter from 'remark-frontmatter';
import stringify from 'rehype-stringify';
import slug from 'rehype-slug';
import headings from 'rehype-autolink-headings';
import prism from '@mapbox/rehype-prism';
import parse from './parse';
import rehype from './rehype';
import yaml from './yaml';
import externalDemo from './externalDemo';
import jsx from './jsx';
import isolation from './isolation';

export default (raw: string, fileAbsDir: string) => {
  const processor = unified()
    .use(parse)
    .use(frontmatter)
    .use(yaml)
    .use(externalDemo, { fileAbsDir })
    .use(rehype, { fileAbsDir })
    .use(stringify, { allowDangerousHTML: true })
    .use(slug)
    .use(headings, {
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['octicon', 'octicon-link'] },
        children: [{ type: 'text', value: '#' }]
      },
      properties: { className: 'anchor' },
    })
    .use(prism)
    .use(jsx)
    .use(isolation);

  return processor.processSync(raw);
};
