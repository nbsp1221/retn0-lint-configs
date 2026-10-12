# Changesets

This directory stores release intent for public workspace packages.

Run `pnpm changeset` in a pull request to declare which packages should be released and which semver bump they need.

## Versioning policy

Version packages from the consumer's perspective:

- `patch`: Fix incorrect configuration, duplicate diagnostics, performance, packaging, or documentation without changing lint or formatting preferences, introducing new diagnostics, or dropping support for existing environments.
- `minor`: Add, remove, or adjust individual lint rules or formatting preferences, add backward-compatible capabilities or tool support, deprecate configuration options, or introduce a breaking change in a pre-1.0 package.
- `major`: Make incompatible changes to imports or configuration APIs, drop supported Node.js or tool versions, or make broad rule-set changes that require substantial consumer migration in a stable package.

Individual lint rule and formatting changes are minor releases even when they introduce new diagnostics or change formatted output. Consumers should review the changelog when upgrading.

Classify dependency updates by their effect on consumers, not the dependency's version number. Development-only updates do not require a package release unless they affect published packages.

## Writing changesets

Write one concise, user-facing changeset per logical change. State the observable behavior and any required migration; omit implementation, test, and pull-request details. A changeset may list multiple packages only when the same summary is accurate and useful in every listed package's changelog.
