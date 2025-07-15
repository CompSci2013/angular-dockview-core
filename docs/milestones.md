## Milestone-1 Tasks

- **Milestone-1.1**: Review `package.json`
  - Confirm `name`, `version`, `main`, `module`, and `typings` entries.
  - Note any `dependencies` or `peerDependencies`.
- **Milestone-1.2**: Outline directory structure
  - List top-level folders (e.g. `dist/cjs/`, `dist/esm/`, `dist/styles/`).
  - Identify where compiled code and type declarations live.
- **Milestone-1.3**: Catalog exported types & interfaces
  - Enumerate public exports from the `.d.ts` files (classes, interfaces, types).
  - Highlight key APIs like `DockviewComponent`, `DockviewApi`, `DockviewPanelConfig`.
- **Milestone-1.4**: Verify call signatures in `.js`
  - Inspect corresponding `.js` files for each public export to confirm method names, parameters, and defaults.
- **Milestone-1.5**: Identify CSS and asset requirements
  - Locate theme or stylesheet files (e.g. `dockview-theme-*.css`) that must be surfaced by your wrapper.
- **Milestone-1.6**: Check for bundled examples or README
  - Look for sample usage, example code, or docs within the package to clarify intended API flows.
- **Milestone-1.7**: Note version-specific quirks
  - Review any CHANGELOG or release notes for breaking changes in v4.3.1.

