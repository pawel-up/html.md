import { esbuildPlugin } from '@web/dev-server-esbuild'

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: '/demo/',
  nodeResolve: {
    browser: true,
    dedupe: ['lit', 'lit-html', 'lit-element', 'lit-html/directives'],
  },

  preserveSymlinks: true,

  middleware: [],

  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'es2024',
    }),
  ],
})
