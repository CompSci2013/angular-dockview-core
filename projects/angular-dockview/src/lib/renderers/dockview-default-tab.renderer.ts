// File: projects/angular-dockview/src/lib/renderers/dockview-default-tab.renderer.ts

export class DockviewDefaultTabRenderer {
  public readonly element: HTMLElement;
  private _panel: any;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('default-tab-renderer');
  }

  init(panel: any, title: string): void {
    this._panel = panel;
    this.update(title);
  }

  update(title?: string): void {
    this.element.textContent = title ?? this._panel?.title ?? '';
  }

  setActions(actions: any[]): void {
    // Stub implementation to satisfy Dockview's expectations
    // In the future, you can render icons or toolbars here
  }

  dispose(): void {
    // No cleanup logic required
  }
}
