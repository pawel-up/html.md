# Classes

## runner

### `SummaryBuilder`
Summary builder is used to create the tests summary reported by
multiple reporters. Each report contains a key-value pair
```ts
constructor(): SummaryBuilder
```
**Methods:**
- `use(reporter: () => { key: string; value: string | string[] }[]): this` — Register a custom summary reporter
- `build(): string[]` — Builds the summary table
