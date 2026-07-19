# Changesets

This directory stores release intent for public workspace packages.

Run `pnpm changeset` in a pull request to declare which packages should be released and which semver bump they need.

## Versioning policy

Version packages from the consumer's perspective:

- `patch`: Fix incorrect configuration, duplicate diagnostics, packaging, or documentation without intentionally introducing new diagnostics.
- `minor`: Add, remove, or adjust individual lint rules and options, or add backward-compatible capabilities.
- `major`: Change the public API, raise the required Node.js or tool versions, or make broad rule-set changes that require substantial consumer migration.

Rule-set changes are part of this opinionated config's expected evolution. Individual rule changes are therefore minor releases even when they may introduce new diagnostics. Consumers should review the changelog when upgrading.

## Writing changesets

Write one concise, user-facing changeset per logical change. State the observable behavior and any required migration; omit implementation, test, and pull-request details. A changeset may list multiple packages only when the same summary is accurate and useful in every listed package's changelog.
