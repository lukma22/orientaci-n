import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../..', import.meta.url));
export default {
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingRoot: root,
  webpack(config, {isServer}) {
    if (!isServer) config.resolve.alias['@quill/engine$'] = fileURLToPath(new URL('../../packages/engine/dist/browser.js', import.meta.url));
    return config;
  },
};
