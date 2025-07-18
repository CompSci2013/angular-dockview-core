# INTENT OF THIS PROJECT

Based on these docs, the clear intent of this project is:

## 1. Provide a robust Angular wrapper for Dockview-core

- Make Dockview’s dockable/tabbed/floating panels feel “native” to Angular, i.e., panels as Angular components—not as plain JS or DOM nodes.

## 2. Solve real integration pain points

- Change detection: Ensure Dockview panel contents stay in sync with Angular’s state and lifecycle.
- Component mounting: Dynamically instantiate and destroy Angular components in response to Dockview events (add, close, float, etc).
- Angular idioms: Expose Dockview’s imperative API as Angular-friendly inputs/outputs/services.

## 3. Replace older, less satisfactory attempts

- The team previously tried GoldenLayout, but Dockview offered a better fit for a modern Angular app.
- The wrapper is meant to replace less maintainable solutions, and to enable large, VSCode-like UIs in Angular.

## 4. Document learnings and dead ends

- The docs act as a log of technical experiments—so future devs can avoid prior mistakes and understand why things are structured this way.

# Project’s Core Goal

Create a production-grade, idiomatic Angular wrapper for Dockview-core v4.x, supporting dynamic Angular panel content, full lifecycle management, and an API that feels native to Angular devs—enabling complex, VSCode-style layouts in Angular applications.
