import path from 'path';
import { parseText } from 'sylvanas';
import getYamlConfig from 'umi-build-dev/lib/routes/getYamlConfig';
import remark from './remark';

const FRONT_COMMENT_EXP = /^\n*\/\*[^]+?\s*\*\/\n*/;
const MD_WRAPPER = `
import React from 'react';
import Alert from '${path.join(__dirname, '../themes/default/alert.js')}';

export default function () {
  return <>$CONTENT</>;
}`

export interface TransformResult {
  content: string;
  config: {
    frontmatter: { [key: string]: any };
    [key: string]: any;
  };
}

export default {
  markdown(raw: string, dir: string): TransformResult {
    const result = remark(raw, dir);

    return {
      content: MD_WRAPPER.replace('$CONTENT', result.contents as string),
      config: {
        frontmatter: {},
        ...result.data as TransformResult['config'],
      },
    };
  },
  jsx(raw: string): TransformResult {
    return {
      // discard frontmatter for source code display
      content: raw.replace(FRONT_COMMENT_EXP, ''),
      config: {
        frontmatter: getYamlConfig(raw),
      },
    };
  },
  tsx(raw: string): TransformResult {
    const result = this.jsx(raw);

    // parse tsx to jsx for source code display
    result.config.jsx = parseText(raw);

    return result;
  },
}
