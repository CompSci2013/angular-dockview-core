**Technical Design Document (Wrapper-TDD)**

**1. Introduction**

- **Purpose**: Provide a clear, step-by-step implementation guide for Milestone-3 (Wrapper Component Design) of the Angular 13 library that wraps `dockview-core@4.3.1`.
- **Audience**: Project managers and developers responsible for designing, implementing, and testing the Angular wrapper library.

**2. Milestone-3 Workflow**

The following iterative process ensures each wrapper feature is implemented, tested, and visually verified in the demo application.

1. **Workspace & Project Setup**

   - Scaffold a new Angular workspace without an initial app:
     ```bash
     ng new dockview-workspace --create-application=false
     cd dockview-workspace
     ```
   - Generate the library and demo application:
     ```bash
     ng generate library angular-dockview
     ng generate application demo
     ```
   - Configure path mappings in `tsconfig.json` and entries in `angular.json` so the `demo` app imports the local library.

2. **Initial Build & Link**

   - Build the library in watch mode (optional):
     ```bash
     ng build angular-dockview --watch
     ```
   - Serve the demo app, which will pick up library rebuilds automatically:
     ```bash
     ng serve demo
     ```

3. **Implement First Wrapper Component**

   - Select a feature from the **Feature Matrix** (e.g., Views) and generate the corresponding Angular component/service:
     ```bash
     ng generate component angular-dockview/DockviewContainer
     ng generate service  angular-dockview/DockviewService
     ```
   - Import and validate types, classes, and call signatures from `dockview-core@4.3.1` against its `.d.ts` files.
   - Expose Angular `@Input()`s and `@Output()`s that delegate to the underlying `DockviewComponent` API.

4. **Hook Up Demo App**

   - In `demo/src/app/app.module.ts`, import `AngularDockviewModule` from the built library.
   - In the demo’s root component template, embed the new wrapper component (e.g., `<adv-dockview-container></adv-dockview-container>`).

5. **Live Testing & Browser Verification**

   - With `ng serve demo` running:
     - Navigate to `http://localhost:4200` and confirm the wrapper renders correctly.
     - Open DevTools: verify CSS (e.g., `dockview.css`) is loaded and styles apply.
     - Exercise UI actions (add/remove panels, drag/drop) and observe expected behaviors.

6. **Iterate Feature by Feature**

   - Repeat steps 3–5 for each feature in the **Feature Matrix**:
     - Panel & Group Add/Remove
     - Active Panel/Group Changes
     - Drag-and-Drop Docking
     - Floating & Pop-out Windows
     - Serializable Layouts
   - Refactor common logic into shared services or base classes as needed.

7. **Automated & Manual Tests**

   - Write Angular unit tests (TestBed) for each wrapper component and service, verifying method calls and event emissions.
   - Optionally, implement end-to-end tests (e.g., Cypress) against the `demo` app to script user flows and validate UI state.

8. **Continuous Build Feedback**

   - Utilize CLI watch builds so library changes trigger incremental rebuilds and live reloads in the demo.
   - Immediately resolve type mismatches by referencing the authoritative `.d.ts` files from `dockview-core@4.3.1`.

9. **Finalize & Document**

   - Update the library’s README with usage examples, API descriptions, and code snippets.
   - Bump the library version, perform a final smoke test in the demo, and prepare for publishing.

**3. Dependency Narrative**

The **Dependency Narrative** describes how features in the **Feature Matrix** build on one another:

1. **Foundational Layer**

   - **Views (Splitview & Gridview)** are the very first feature to implement—they provide the container framework for everything else.
   - **Theming & Styles** can be integrated in parallel or later, since they don’t affect core behavior.

2. **Core Panel Management**

   - Once you have views, you can add and remove panels/groups (**Panel & Group Add/Remove**).
   - With panels present, you expose which one is currently in focus (**Active Panel/Group Changes**).

3. **Advanced Interaction**

   - Building on add/remove, you wire up **Drag-and-Drop Docking**, letting users rearrange panels visually.
   - **Floating & Pop-out Windows** is a special case of docking: panels become their own floating “views,” so you need drag/drop plus the ability to detach a panel into a new window.

4. **State Serialization**

   - **Serializable Layouts** sits atop everything: it snapshots views, panel positions, active states, and floating windows into JSON and can rehydrate them.
   - You can start with serializing just views and panel placements early, then layer in active-state and pop-out details as those features come online.

**4. Appendix**

- **Feature Matrix**: Refer to the **Dockview-Core Feature-Component-Event Matrix** for complete mapping of features, underlying components, and events.

**5. Feature Matrix**

Below is the **Dockview-Core Feature-Component-Event Matrix** (short: **Feature Matrix**) in markdown form:

| Feature                      | Components                                                    | Events                                                                                                    |
| ---------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Serializable Layouts         | `DockviewComponent`, `GridviewComponent`, `PaneviewComponent` | `onDidLayoutChange`, `onDidLayoutFromJSON`                                                                |
| Views (Splitview & Gridview) | `SplitviewComponent`, `GridviewComponent`                     | `onDidAddView`, `onDidRemoveView`, `onUnhandledDragOverEvent`, `onDidLayoutChange`, `onDidLayoutFromJSON` |
| Panel & Group Add/Remove     | `DockviewComponent`, `IDockviewPanel`, `DockviewGroupPanel`   | `onDidAddPanel`, `onDidRemovePanel`, `onDidAddGroup`, `onDidRemoveGroup`                                  |
| Active Panel/Group Changes   | `DockviewComponent`, `IDockviewPanel`                         | `onDidActivePanelChange`, `onDidActiveGroupChange`, panel-level `onDidActiveChange`                       |
| Drag-and-Drop Docking        | `DockviewComponent`                                           | `onWillDragPanel`, `onWillDragGroup`, `onDidDrop`, `onWillDrop`, `onUnhandledDragOverEvent`               |
| Floating & Pop-out Windows   | `DockviewComponent`                                           | `onDidPopoutGroupPositionChange`, `onDidPopoutGroupSizeChange`, `onDidOpenPopoutWindowFail`               |
| Theming & Styles             | CSS assets (`dist/styles/dockview.css`)                       | _No event-based theming API_                                                                              |
