# Contributing to FlagPulse SDKs

Thank you for your interest in contributing to the FlagPulse SDK ecosystem.

This repository contains the official SDKs used to integrate applications with FlagPulse. Contributions can include bug fixes, improvements, documentation, tests, new SDKs, and other enhancements.

## Before You Start

Before making a change, check the existing issues and pull requests to see whether the work has already been discussed.

For larger changes, open an issue first so the proposed approach can be discussed before implementation.

## Repository Structure

```text
flagpulse-sdk/
├── flagpulse-react/
│   └── React SDK
│
├── CONTRIBUTING.md
└── README.md
```

Each SDK is maintained independently and contains its own documentation and development requirements.

When working on an SDK, refer to its README and package configuration for SDK-specific instructions.

## Development Setup

Clone the repository and install the dependencies for the SDK you want to work on.

```bash
git clone https://github.com/hitheshn208/flagpulse-sdk.git
cd flagpulse-sdk
```

Then move into the relevant SDK directory and install its dependencies.

```bash
cd <sdk-directory>
npm install
```

Run the SDK's available development or test commands as defined in its `package.json`.

## Making Changes

Keep changes focused and related to the issue or feature being addressed.

When contributing to an existing SDK:

1. Make your changes within that SDK's directory.
2. Follow the existing project structure and coding style.
3. Add or update tests when changing behavior.
4. Update the SDK documentation when its public API or behavior changes.
5. Make sure the project builds successfully before opening a pull request.

Avoid making unrelated changes in the same pull request.

## Adding a New SDK

New SDKs are welcome when they provide a useful integration with FlagPulse.

A new SDK should:

* Have its own directory at the repository root.
* Include its own `README.md`.
* Include a `package.json` or equivalent package configuration.
* Include appropriate tests.
* Follow the existing repository conventions.
* Clearly document installation, usage, configuration, and supported functionality.

If the SDK introduces a new language or ecosystem, discuss the proposed structure in an issue before starting significant implementation work.

## Branches

Create a separate branch for your work instead of committing directly to `main`.

Use a descriptive branch name such as:

```text
feature/add-nextjs-sdk
fix/sse-reconnection
docs/update-react-readme
refactor/client-cache
```

## Commits

Keep commits focused and descriptive.

A preferred format is:

```text
type: short description
```

Examples:

```text
feat: add Next.js SDK
fix: handle SSE reconnection
docs: update React SDK usage
test: add flag evaluation tests
refactor: simplify client cache
```

Avoid committing generated files, secrets, environment files, or local configuration.

## Pull Requests

Before opening a pull request:

* Make sure the relevant tests pass.
* Make sure the SDK builds successfully.
* Review your changes for unintended modifications.
* Update documentation where necessary.
* Rebase or merge the latest `main` changes if required.

Pull requests should clearly explain:

* What was changed.
* Why the change was needed.
* How the change was tested.
* Any relevant limitations or considerations.

Keep pull requests focused so they are easier to review.

## Documentation

If a change affects how users interact with an SDK, update the corresponding SDK documentation.

Examples include:

* New public APIs.
* Changed configuration options.
* New installation requirements.
* Changed behavior.
* New supported frameworks or environments.

Repository-wide documentation belongs in the root of this repository, while SDK-specific documentation belongs inside the relevant SDK directory.

## Issues

When reporting a bug, include enough information to reproduce it.

Useful information includes:

* SDK and version.
* Runtime or framework version.
* Operating system.
* Steps to reproduce the issue.
* Expected behavior.
* Actual behavior.
* Relevant error messages or logs.

For feature requests, describe the problem the feature would solve and the proposed behavior rather than only describing the implementation.

## Code of Conduct

Please be respectful and constructive when participating in the project.

Contributors are expected to communicate professionally and help maintain an inclusive and welcoming open-source community.

## License

By contributing to this repository, you agree that your contributions will be licensed under the same license as the project.

FlagPulse SDKs are licensed under the **GNU General Public License v3.0**. See the [LICENSE](./LICENSE) file for details.

---

Thank you for contributing to FlagPulse.
