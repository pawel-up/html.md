# Classes

## refiner

### `Refiner`
Exposes the API to refine unwanted tests based upon applied
filters.
```ts
constructor(filters: FilteringOptions): Refiner
```
**Methods:**
- `matchAllTags(state: boolean): this` — Enable/disable matching of all tags when filtering tests.
If "matchAll" is enabled, the test tags should match
all the user defined tags.

Otherwise, any one match will pass the filter
- `pinTest(test: Test<any>): void` — Pin a test to be executed.
- `isPinned(test: Test<any>): boolean` — Find if a test is pinned
- `add(layer: "tags" | "groups" | "tests", values: string[]): void` — Add a filter
- `allows(testOrGroup: Test<any> | Group): boolean` — Check if refiner allows a specific test or group to run by looking
at the applied filters
```ts
const refiner = new Refiner({ tags: ['@slow'] })
refiner.allows('tags', ['@slow']) // true
refiner.allows('tags', ['@regression']) // false

const refiner = new Refiner({ tags: [] })
refiner.allows('tags', ['@slow']) // true
refiner.allows('tags', ['@regression']) // true
```
