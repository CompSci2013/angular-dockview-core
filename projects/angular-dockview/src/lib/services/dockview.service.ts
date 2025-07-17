// File: dockview.service.ts
/* -------------------------
 * The “facade” service—talks to dockview-core, exposes open/close/focus, and bridges to other services.
 * ----------------------------------------------*/
import { Injectable } from '@angular/core';
import { DockviewApi } from 'dockview-core/dist/cjs/api/component.api';
import { IDockviewPanel } from 'dockview-core';
import { DockviewPanelConfig, DockviewHeaderAction } from '../dockview.types'; // adjust path as needed

@Injectable({ providedIn: 'root' })
export class DockviewService {
  private api?: DockviewApi;

  // Called by the wrapper component once api is ready
  setApi(api: DockviewApi): void {
    this.api = api;
  }

  getApi(): DockviewApi | undefined {
    return this.api;
  }

  openPanel(opts: DockviewPanelConfig): IDockviewPanel | undefined {
    if (!this.api) {
      return;
    }

    // Check if already exists
    const existing = this.api.getPanel(opts.id);
    if (existing) {
      if (opts.float) {
        this.makeFloat(existing);
      }
      (existing as any).setActive?.();
      return existing;
    }

    // Default popout action (optional)
    const defaultHeaderActions: DockviewHeaderAction[] = [
      {
        id: 'popout',
        label: 'Popout',
        icon: 'codicon codicon-link-external',
        tooltip: 'Open in Floating Window',
        command: (panel: any) => {
          panel.popout?.();
        },
        run: () => {}, // Required by interface
      },
    ];

    const panel = this.api.addPanel({
      id: opts.id,
      component: opts.component,
      title: opts.title,
      params: {
        inputs: opts.inputs ?? {},
        headerActions: opts.headerActions ?? defaultHeaderActions,
      },
      floating: opts.float ? true : undefined,
    });

    // PanelConfig registry logic should be handled by PanelStateService now.
    // this.panelStateService.registerPanelConfig(opts);

    return panel;
  }

  closePanel(id: string): void {
    if (!this.api) return;
    const panel = this.api.getPanel(id);
    if (panel) {
      this.api.removePanel(panel);
      // this.panelStateService.clearPanelConfig(id);
    }
  }

  focusPanel(id: string): void {
    if (!this.api) return;
    const panel = this.api.getPanel(id);
    (panel as any)?.setActive?.();
    // Optionally, update panel state service about focus here
  }

  toggleFloat(id: string): void {
    if (!this.api) return;
    const panel = this.api.getPanel(id);
    if (!panel) return;
    const wasFloating = (panel as any).isFloating === true;
    const opts: DockviewPanelConfig = {
      id,
      title: panel.title,
      component: (panel as any).view.contentComponent,
      float: !wasFloating,
      inputs: (panel as any).params?.inputs,
    };
    this.closePanel(id);
    this.openPanel(opts);
  }

  // --- Helpers (private) ---

  private makeFloat(panel: IDockviewPanel): void {
    (panel as any).float?.();
  }

  private makeDock(panel: IDockviewPanel): void {
    (panel as any).dock?.();
  }

  private isFloating(panel: IDockviewPanel): boolean {
    return (panel as any).isFloating === true;
  }
}
