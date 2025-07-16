// FILE: projects/angular-dockview/src/lib/dockview.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DockviewApi, IDockviewPanel } from 'dockview-core';
import { DockviewPanelConfig, DockviewHeaderAction } from './dockview.types'; // ← shared type

@Injectable({ providedIn: 'root' })
export class AngularDockviewService {
  /** Populated once by DockviewContainerComponent */
  private _api: DockviewApi | null = null;

  /** Optional event emitter for header action clicks */
  public readonly headerActionFired?: Subject<{
    panelId: string;
    actionId: string;
  }> = new Subject();

  /** Called by DockviewContainerComponent after Dockview is available */
  setApi(api: DockviewApi): void {
    this._api = api;
  }

  /** Consumer-side accessor for the live DockviewApi */
  getApi(): DockviewApi | null {
    return this._api;
  }

  /* ----------------------------------------------------------------
   * High-level helpers
   * ---------------------------------------------------------------- */

  openPanel(opts: DockviewPanelConfig): IDockviewPanel | undefined {
    if (!this._api) {
      return;
    }

    const existing = this._api.getPanel(opts.id);
    if (existing) {
      if (opts.float) {
        this.makeFloat(existing);
      }
      (existing as any).setActive?.();
      return existing;
    }

    // Inject popout header button if not explicitly overridden
    const defaultHeaderActions: DockviewHeaderAction[] = [
      {
        id: 'popout',
        label: 'Popout',
        icon: '🗗',
        tooltip: 'Open in Floating Window',
        command: (panel: any) => {
          panel.popout?.();
        },
        run: () => {}, // run is required by the interface, noop here
      },
    ];

    const returnable = this._api.addPanel({
      id: opts.id,
      component: opts.component,
      title: opts.title,
      params: {
        inputs: opts.inputs ?? {},
        headerActions: opts.headerActions ?? defaultHeaderActions,
      },
      floating: opts.float ? true : undefined,
    });
    return returnable;
  }

  toggleFloat(id: string): void {
    const p = this._api?.getPanel(id);
    if (!p) {
      return;
    }
    const wasFloating = (p as any).isFloating === true;
    const opts: DockviewPanelConfig = {
      id,
      title: p.title,
      component: (p as any).view.contentComponent,
      float: !wasFloating,
      inputs: (p as any).params?.inputs,
    };
    this.closePanel(id);
    this.openPanel(opts);
  }

  closePanel(id: string): void {
    const p = this._api?.getPanel(id);
    if (p) {
      this._api?.removePanel(p);
    }
  }

  focusPanel(id: string): void {
    const p = this._api?.getPanel(id);
    (p as any)?.setActive?.();
  }

  updateHeaderActions(id: string, actions: DockviewHeaderAction[]): void {
    console.log('id', id);
    console.dir(actions);
    const p = this._api?.getPanel(id);
    if (!p) {
      return;
    }
    console.log('found panel');
    console.dir(p);
    // Prefer modern updateParameters if available
    if (typeof (p as any).updateParameters === 'function') {
      (p as any).updateParameters({ params: { headerActions: actions } });
    } else if (typeof (p as any).setActions === 'function') {
      // Legacy fallback
      (p as any).setActions(actions);
    }
  }

  /* ----------------------------------------------------------------
   * Internal helpers – typed as any because 4.3.1 typings don't expose them
   * ---------------------------------------------------------------- */
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
