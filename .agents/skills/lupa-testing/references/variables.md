# Variables & Constants

## assert

### `default`
Browser test plugin for assertion support.

Usage in config:
```typescript
testPlugins: ['@pawel-up/lupa/assert']
```
```ts
const default: WebPluginFn
```

## testing

### `html`
`html` template tag from `lit-html`.
Used for creating DOM templates to be rendered by fixture.
```ts
const html: (strings: TemplateStringsArray, values: unknown[]) => TemplateResult<1>
```

## reporters

### `reporterNames`
Built-in reporter names.
```ts
const reporterNames: readonly ["dot", "ndjson", "github", "progress", "json"]
```

### `progress`
Create an instance of the progress reporter
```ts
const progress: (options?: BaseReporterOptions) => NamedReporterContract
```

### `dot`
Create an instance of the dot reporter
```ts
const dot: (options?: BaseReporterOptions) => NamedReporterContract
```

### `ndjson`
Create an instance of the ndjson reporter
```ts
const ndjson: (options?: BaseReporterOptions) => NamedReporterContract
```

### `github`
Create an instance of the github reporter
```ts
const github: (options?: BaseReporterOptions) => NamedReporterContract
```

### `json`
Create an instance of the json reporter
```ts
const json: (options?: BaseReporterOptions) => ProgrammaticReporterContract<JSONReporterResult>
```

## network

### `bypass`
Return this symbol from a dynamic response closure to explicitly bypass the current mock.
This instructs Lupa to fall through to the next registered mock, or defer to the real network.
```ts
const bypass: unique symbol
```

### `default`
Browser test plugin for network mocking support.

Usage in config:
```typescript
testPlugins: ['@pawel-up/lupa/network']
```
```ts
const default: WebPluginFn
```
