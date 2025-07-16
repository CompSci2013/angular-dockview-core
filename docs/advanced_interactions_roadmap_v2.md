# ✅ Advanced Interactions Roadmap — Status-Aware

## 1. ✅ Drag-and-Drop Docking

- ✅ Works via dockview-core internals (panels can be dragged).
- 🔜 The wrapper must expose all related events:
  - `@Output() willDragPanel` from `DockviewApi.onWillDragPanel`
  - `@Output() willDrop` from `DockviewApi.onWillDrop`
  - `@Output() didDrop` from `DockviewApi.onDidDrop`

## 2. ⏳ Floating / Pop‑out Panels

- ⏳ Wrapper does not yet support floating.
- TODO:
  - `@Input() enableFloating`
  - `@Output() didPopoutGroupPositionChange`
  - `@Output() didPopoutGroupSizeChange`

## 3. ⏳ Resizing Constraints

- ⏳ Not yet implemented.
- TODO:
  - Add `@Input() minWidth`, `maxWidth`, `minHeight`, `maxHeight`
  - Pass to `DockviewComponentOptions` or individual panel creation

## 4. ⏳ Context Menus & Custom Actions

- ⏳ No support for custom Angular templates in toolbar/header yet.
- TODO:
  - `@Input() headerTemplate: TemplateRef<any>`
  - `@Output() didRequestClose` (when/if supported)

## 5. ⏳ Demo Enhancements

- ⏳ The demo app currently lacks controls.
- TODO:
  - Buttons to toggle floating mode, change themes, trigger layout save/load

## 6. ✅ Panel Add/Remove

- ✅ `addPanel()` is fully functional
- 🔜 Expose:
  - `@Output() didAddPanel` from `DockviewApi.onDidAddPanel`
  - `@Output() didRemovePanel` from `DockviewApi.onDidRemovePanel`

## 7. 🔜 Active Panel/Group State

- 🔜 Focus change events not surfaced
- TODO:
  - `@Output() activePanelChange`
  - `@Output() activeGroupChange`

## 8. ⏳ Serializable Layouts

- ⏳ Not yet implemented
- TODO:
  - Expose `saveLayout()` and `loadLayout(json)`
  - Add `@Output() layoutChange` from `onDidLayoutChange`

# ✅ Final Feature-Component-Event Matrix (Corrected)

| Feature                      | Components                                                    | Events                                                                                                    |
| ---------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Serializable Layouts         | `DockviewComponent`, `GridviewComponent`, `PaneviewComponent` | `onDidLayoutChange`, `onDidLayoutFromJSON`                                                                |
| Views (Splitview & Gridview) | `SplitviewComponent`, `GridviewComponent`                     | `onDidAddView`, `onDidRemoveView`, `onUnhandledDragOverEvent`, `onDidLayoutChange`, `onDidLayoutFromJSON` |
| Panel & Group Add/Remove     | `DockviewComponent`, `IDockviewPanel`, `DockviewGroupPanel`   | `onDidAddPanel`, `onDidRemovePanel`, `onDidAddGroup`, `onDidRemoveGroup`                                  |
| Active Panel/Group Changes   | `DockviewComponent`, `IDockviewPanel`                         | `onDidActivePanelChange`, `onDidActiveGroupChange`, `onDidActiveChange`                                   |
| Drag-and-Drop Docking        | `DockviewComponent`                                           | `onWillDragPanel`, `onWillDrop`, `onDidDrop`                                                              |
| Floating & Pop-out Windows   | `DockviewComponent`                                           | `onDidPopoutGroupSizeChange`, `onDidPopoutGroupPositionChange`, `onDidOpenPopoutWindowFail`               |
| Theming & Styles             | CSS assets (`dockview.css`)                                   | _No event-based theming API_                                                                              |
