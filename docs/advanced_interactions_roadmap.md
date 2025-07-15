```markdown
# Advanced Interactions Roadmap

Moving into **Advanced Interactions**, here’s a roadmap for our next set of features:

## 1. Enable Drag‑and‑Drop Docking

- **Expose** Dockview’s `onDidBeginDrop` and `onDidDropPanel` events through our Angular wrapper.
- **Add** corresponding `@Output()` emitters:
  - `didBeginDrag`
  - `didDropPanel`

## 2. Floating / Pop‑out Panels

- **Leverage** `DockviewComponentOptions` flags (e.g. `enableFloating`) to toggle floating windows.
- **Wire up** the `onDidPopoutPanel` event and expose it via an `@Output()`.

## 3. Resizing Constraints

- **Support** minimum/maximum width and height per panel via new `@Input()`s on `<adv-dockview-container>`.
- **Pass** these constraints into `DockviewComponentOptions` and validate in the API callbacks.

## 4. Context Menus & Custom Actions

- **Provide** a mechanism for consumers to pass Angular `TemplateRef`s for header/toolbars.
- **Expose** events like `onDidRequestClose` to hook up custom dialogs or confirm flows.

## 5. Demo Verification

- **Enhance** the demo app with controls (buttons or sidebar) to:
  - Toggle floating mode on/off
  - Modify styling/theme
  - Test drag/drop docking behavior interactively
```
