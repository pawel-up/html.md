# Configuring Vite

Lupa runs your tests inside a headless browser using [Vite](https://vitejs.dev/) as its development server and build pipeline.

By default, Lupa will automatically discover and use your project's `vite.config.ts` (or `vite.config.js`) file, just like a standard Vite application. This means you can use the same Vite plugins, aliases, and loaders in your tests that you use in your application code.

## Example: Supporting Standard ES Decorators

A common use case for customizing the Vite configuration in a testing environment is to support bleeding-edge syntax that isn't fully implemented in all browsers yet, such as **Standard ES Decorators** (Stage 3).

Vite 8 uses [Oxc](https://oxc-project.github.io/) to transform TypeScript by default. While extremely fast, Oxc currently passes standard decorators directly through to the output, which causes a `SyntaxError` when the test runner loads the file in a browser like Chromium.

To fix this, you can configure Vite to pre-transform TypeScript files using `esbuild` (which natively transpiles standard decorators into JavaScript functions) before Vite's default pipeline processes them.

### 1. Update `vite.config.ts`

Create or update your `vite.config.ts` in the root of your project:

```ts
import { defineConfig } from 'vite'
import esbuild from 'esbuild'

export default defineConfig({
  plugins: [
    {
      name: 'esbuild-decorators',
      enforce: 'pre',
      async transform(code, id) {
        // Only run on TypeScript files that actually contain decorators
        if (id.endsWith('.ts') && code.includes('@')) {
          const result = await esbuild.transform(code, {
            loader: 'ts',
            target: 'es2024',
            sourcemap: true,
            sourcefile: id,
          })

          return { code: result.code, map: result.map }
        }
      },
    },
  ],
})
```

> [!NOTE]
> By omitting `tsconfigRaw` in the `esbuild.transform()` options, esbuild assumes standard decorators and natively transpiles them down to standard JavaScript, preventing browser `SyntaxError`s.

> [!WARNING]
> It is critical to include `sourcemap: true` and `sourcefile: id` in the `esbuild.transform()` options. Without these, Vite will not receive a source map for the type-stripping transformation, which will lead to highly inaccurate stack traces and line numbers when a test fails.

### 2. Run your tests

Lupa will automatically pick up your `vite.config.ts` without any extra configuration required in your `lupa.config.ts` file!

```bash
npx lupa test
```

## Inline configuration

If you do not want to use a `vite.config.ts` file, or if you need specific Vite settings that only apply during testing (and shouldn't affect your production build), you can pass Vite configuration directly to the `configure()` method in your `lupa.config.ts` runner:

```ts
import { configure, run } from '@pawel-up/lupa/runner'
import esbuild from 'esbuild'

configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/**/*.test.ts'],
    },
  ],
  vite: {
    plugins: [
      {
        name: 'esbuild-decorators',
        enforce: 'pre',
        async transform(code, id) {
          if (id.endsWith('.ts') && code.includes('@')) {
            const result = await esbuild.transform(code, {
              loader: 'ts',
              target: 'es2024',
              sourcemap: true,
              sourcefile: id
            })
            return { code: result.code, map: result.map }
          }
        },
      },
    ],
  }
})

run()
```

When you define `vite` properties inside the `configure()` block, Lupa will merge them with your `vite.config.ts` automatically.