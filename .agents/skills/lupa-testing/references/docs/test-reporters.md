# Test Reporters

Test reporters are used to collect test progress and display a summary after the tests have been executed.

A test reporter can choose the format and the destination where it wants to display the progress and the summary. For example, the `spec` reporter writes a structured, colorful output to the terminal or browser console.

## Registering and activating reporters

Reporters are registered when configuring Lupa via the `configure` method.

```ts
import { defineConfig } from '@pawel-up/lupa/runner'
import * as reporters from '@pawel-up/lupa/reporters'

export default defineConfig({
  reporters: {
    activated: ['progress'],
    list: [
      reporters.progress(),
      reporters.ndjson(),
      reporters.dot(),
      reporters.github(),
    ],
  }
})
```

By default, all built-in reporters are registered inside the `list` array, and only the `progress` reporter is activated.

The default reporters include:
- `progress`
- `dot`
- `ndjson`
- `github`

If you manually define the `reporters` property inside the configuration block, the defaults will be removed. Make sure to manually register the reporters you want to use if you overwrite the property!

## Activating using command-line

You can activate or switch between the reporters from the command line using the `--reporters` CLI flag when running tests. Ensure the reporter is registered in the `list` before you can activate it.

```sh
npx lupa test --reporters=dot
npx lupa test --reporters=ndjson
```

If you try to activate a non-registered reporter, Lupa will throw an error:

```sh
npx lupa test --reporters=list
# Error: Invalid reporter "list". Make sure to register it first inside the "reporters.list" array.
```

## The progress reporter

The `progress` reporter displays the test output in a structured format as a colorful output in the terminal. This is the default reporter.

## The dot reporter

The `dot` reporter displays the test output using only icons (dots for success, crosses for failures) and without suite or test titles. It is very useful for running large test suites compactly.

## The ndjson reporter

The `ndjson` reporter outputs each event as a valid JSON string to the terminal line by line. The JSON output is an excellent fit for programmatic use cases when integrating Lupa with other tools.

## The github reporter

The `github` reporter reports errors as annotations when running tests as part of GitHub Actions. You can view individual errors by clicking on the annotation, and GitHub will take you directly to the source file where the error occurred.

The reporter is activated automatically in the GitHub Actions environment. However, if you have overridden the `reporters` property inside the configuration, you must enable it manually:

```ts
import { defineConfig } from '@pawel-up/lupa/runner'
import * as reporters from '@pawel-up/lupa/reporters'

const activated = ['progress']
// Or using multiple reporters:
// const activated = ['progress', 'github']
if (process.env.GITHUB_ACTIONS === 'true') {
  activated.push('github')
}

export default defineConfig({
  reporters: {
    activated,
    list: [
      reporters.spec(),
      reporters.ndjson(),
      reporters.dot(),
      reporters.github(),
    ],
  }
})
```

## Creating a custom reporter

You can create and register custom test reporters with Lupa. A test reporter must implement the core reporting lifecycle by extending `BaseReporter` from `@pawel-up/lupa/reporters` or by registering a custom class conforming to the reporting contract.

### Defining a reporter

Let's start by creating a custom reporter class. You can implement methods to listen for different events emitted during the test lifecycle.

```ts
import { BaseReporter } from '@pawel-up/lupa/reporters/base'
import type { TestStartNode, TestEndNode, GroupStartNode, GroupEndNode, SuiteStartNode, SuiteEndNode, RunnerStartNode, RunnerEndNode } from '@pawel-up/lupa/reporters/base'

class MyCustomReporter extends BaseReporter {
  static name = 'custom'

  onTestStart(testPayload: TestStartNode) {
    console.log('test started "%s"', testPayload.title)
  }

  onTestEnd(testPayload: TestEndNode) {
    console.log('test completed "%s"', testPayload.title)
  }

  onGroupStart(groupPayload: GroupStartNode) {
    console.log('group started "%s"', groupPayload.title)
  }

  onGroupEnd(groupPayload: GroupEndNode) {
    console.log('group ended "%s"', groupPayload.title)
  }

  onSuiteStart(suitePayload: SuiteStartNode) {
    console.log('suite started "%s"', suitePayload.name)
  }

  onSuiteEnd(suitePayload: SuiteEndNode) {
    console.log('suite completed "%s"', suitePayload.name)
  }

  async start(node: RunnerStartNode) {
    console.log('starting')
  }

  async end(node: RunnerEndNode) {
    console.log('completed')
  }
}
```

### Registering custom reporter

Once you have defined a custom reporter, register it in the entry point file.

```ts
import { defineConfig } from '@pawel-up/lupa/runner'

export default defineConfig({
  reporters: {
    activated: [MyCustomReporter.name],
    list: [
      {
        name: MyCustomReporter.name,
        handler: (...args) => new MyCustomReporter().boot(...args),
      }
    ]
  }
})
```

### Accessing the test summary

Once all the tests have been executed, you can access the test summary within the `end` method using the `this.runner.getSummary()` method.

```ts
class MyCustomReporter extends BaseReporter {
  async end() {
    const summary = this.getRunnerOrThrow().getSummary()
    console.log(summary)
  }
}
```

The summary object includes properties like `aggregates` (number of tests passed, failed, skipped), `hasError` (boolean), `duration`, `failureTree` (nested tree of errors), and `failedTestsTitles`.

### Printing the test summary

You may use the `this.printSummary` method to print the summary to the terminal with formatting and colors built into `BaseReporter`.

```ts
class MyCustomReporter extends BaseReporter {
  async end() {
    const summary = this.getRunnerOrThrow().getSummary()
    await this.printSummary(summary)
  }
}
```