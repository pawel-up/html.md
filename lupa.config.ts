/* eslint-disable no-restricted-globals */
import { defineConfig } from '@pawel-up/lupa/runner'
import { progress, github, json, ndjson } from '@pawel-up/lupa/reporters'
import type { Assert } from '@pawel-up/lupa/assert'
import type { Network } from '@pawel-up/lupa/network'

const activated = ['progress']
if (process.env.GITHUB_ACTIONS === 'true') {
  activated.push('github')
}

export default defineConfig({
  testPlugins: ['@pawel-up/lupa/assert', '@pawel-up/lupa/network'],
  reporters: {
    activated,
    list: [progress(), github(), json(), ndjson()],
  },
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts'],
    },
  ],
  vite: {
    optimizeDeps: {
      include: ['axe-core', 'sinon'],
      exclude: ['@pawel-up/lupa'],
    },
  },
})

declare module '@pawel-up/lupa/testing' {
  interface TestContext {
    assert: Assert
    network: Network
  }
}
