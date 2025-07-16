import { Component } from '@angular/core';
import { defaultConfig, nextId } from './default-layout';
import { DockviewApi } from 'angular-dockview';
import type { IDockviewPanel } from 'dockview-core';
import type { DockviewHeaderAction } from 'angular-dockview';

interface EventLogEntry {
  id: number;
  timestamp: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  events: EventLogEntry[] = [];
  showEvents = true;
  private counter = 0;
  private savedLayout = '';
  private _api!: DockviewApi;

  onReady(api: DockviewApi): void {
    this._api = api;

    defaultConfig(api);
    api.onDidAddGroup((evt) => this.log(`Group Added ${evt.id}`));
    api.onDidAddPanel((evt) => this.log(`Panel Added ${evt.id}`));
    api.onDidActiveGroupChange((evt) => this.log(`Group Activated ${evt?.id}`));
    api.onDidActivePanelChange((evt) => this.log(`Panel Activated ${evt?.id}`));
  }

  addPanel(): void {
    const id = `panel_${nextId()}`;

    const headerActions: DockviewHeaderAction[] = [
      {
        id: 'popout',
        tooltip: 'Pop Out',
        icon: 'codicon codicon-new-window',
        command: (panel: IDockviewPanel) => {
          this.log(`Popout clicked on ${panel.id}`);

          const url = `${window.location.origin}/?panelId=${panel.id}`;
          window.open(url, '_blank', 'popup,width=800,height=600');
        },
        run: () => {},
      },
    ];

    this._api.addPanel({
      id,
      component: 'default',
      title: id,
      params: {
        inputs: {
          headerActions, // ✅ wrapper-compliant injection point
        },
      },
    });
  }

  addNestedPanel(): void {
    const active = this._api.activeGroup?.activePanel;
    const id = `panel_${nextId()}`;
    this._api.addPanel({
      id,
      component: 'default',
      title: id,
      position: { referencePanel: active! },
    });
  }

  addGroup(): void {
    const active = this._api.activeGroup?.activePanel!;
    const id = `group_${nextId()}`;
    this._api.addGroup({ id, referencePanel: active, direction: 'right' });
  }

  useCustomWatermark(): void {
    (this._api as any).setWatermark('My Custom Watermark');
  }

  clear(): void {
    this.events = [];
  }

  save(): void {
    this.savedLayout = JSON.stringify(this._api.toJSON());
    this.log('Layout Saved');
  }

  load(): void {
    if (this.savedLayout) {
      this._api.fromJSON(JSON.parse(this.savedLayout));
      this.log('Layout Loaded');
    }
  }

  reset(): void {
    defaultConfig(this._api);
    this.log('Layout Reset');
  }

  private log(message: string): void {
    this.events.unshift({
      id: ++this.counter,
      timestamp: new Date().toLocaleTimeString(),
      message,
    });
  }
}
