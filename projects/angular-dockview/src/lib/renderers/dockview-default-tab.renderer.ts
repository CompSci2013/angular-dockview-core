// File: projects/angular-dockview/src/lib/renderers/dockview-default-tab.renderer.ts
import type { TabPartInitParameters } from 'dockview-core';

export class DockviewDefaultTabRenderer {
  public readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('default-tab-renderer');
  }

  init(params: TabPartInitParameters): void {
    this.updateTitle(params.title);
  }

  updateTitle(title?: string): void {
    this.element.textContent = title ?? null;
  }

  setActions(actions: any[]): void {
    // Stub implementation to satisfy Dockview's expectations
    // In the future, you can render icons or toolbars here
  }

  dispose(): void {
    this.element.remove();
  }
}
