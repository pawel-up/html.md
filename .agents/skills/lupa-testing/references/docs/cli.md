# Lupa CLI Reference

Lupa provides a lightweight, interactive Command-Line Interface to help you run tests, scaffold environments, and import agent skills into your workspace.

While the test execution is entirely driven by your `lupa.config.ts` file, the CLI provides convenient entry points to execute, filter, and discover your tests.

---

## `lupa test`

The primary command for executing your Lupa test suite. By default, it automatically detects and loads `lupa.config.ts` from your current directory and runs the test runner.

```bash
npx lupa test
```

### Filtering & Options
You can narrow down what gets executed using various filters:

- `--files <files...>`: Filter tests by file name substring (e.g. `npx lupa test --files auth.spec.ts`)
- `--tests <titles...>`: Filter tests by test title (e.g. `npx lupa test --tests "Login"`)
- `--groups <titles...>`: Filter tests by group title
- `--tags <tags...>`: Filter tests by tags (e.g. `npx lupa test --tags="@slow"`)
- `--match-all`: Run tests that match all supplied tags instead of any of them.
- `--failed`: Only run tests that failed during the last run.

### Execution Control
- `--watch`: Watch for file changes and intelligently re-run affected tests.
- `--bail`: Exit early when a test fails.
- `--timeout <duration>`: Define a default timeout for all tests.
- `--retries <count>`: Define default retries for all tests.

### Runner Options
- `-c, --config <path>`: Path to a custom configuration file (defaults to `lupa.config.ts`).
- `--reporters <names...>`: Activate one or more test reporters (e.g., `npx lupa test --reporters html`).
- `--browser <browser>`: Specify the browser to run tests in (choices: `chromium`, `firefox`, `webkit`).
- `--verbose`: Enable verbose logging.

---

## `lupa list`

Discover and list available tests without running them. This is useful for introspecting your test architecture or for programmatic integrations (like AI agents).

```bash
npx lupa list
```

By default, it outputs a clean, human-readable table of your Suites, Groups, and Tests.

### Format Option
You can output the test tree as structured JSON using the `--format` flag:

```bash
npx lupa list --format json
```

### Filtering
The `list` command accepts the same filtering options as the `test` command. For example, to list all tests in a specific file:

```bash
npx lupa list --files auth.spec.ts
```

---

## `lupa init`

The `init` command interactively scaffolds your test configuration file, creates your test directories, and seeds them with example `.spec.ts` files.

```bash
npx lupa init
```

### Interactive Flow
By default, `lupa init` runs in interactive mode and will prompt you to:
1. Provide a path for the configuration file (defaults to `./lupa.config.ts`).
2. Specify the target directory for your test files (e.g., `./tests`).
3. Select which test suites you want to organize your project into (e.g., `unit`, `functional`, `e2e`).
4. Select the reporters you wish to activate (e.g., `spec`, `dot`).

### Non-Interactive / CI Usage
You can bypass the interactive prompts by providing the required flags. This is particularly useful for automated setup scripts or CI environments.

```bash
npx lupa init --config ./lupa.config.ts --test-dir ./tests --suites unit,functional --reporters spec --yes
```

**Options:**
- `--config <path>`: Path to the test configuration file.
- `--test-dir <path>`: Directory where test files will be located.
- `--suites <names>`: Comma separated list of suite names (e.g. `unit,functional`), or `"all"`, or `"none"`.
- `--reporters <names>`: Comma separated list of reporters to use.
- `-y, --yes`: Overwrite existing files without prompting for confirmation.

---

## `lupa skills`

Lupa includes built-in AI agent skills that help autonomous coding assistants (like Antigravity or GitHub Copilot) understand how to write and debug tests using the Lupa framework.

The `skills` command injects these instructions directly into your workspace's `.agents/skills` directory so your AI assistant can read them.

```bash
npx lupa skills
```

### Usage
Run the command in the root of your project. It will copy the documentation and best practices to `.agents/skills/lupa-testing`.

**Options:**
- `-y, --yes`: Overwrite an existing `lupa-testing` skills directory without prompting.