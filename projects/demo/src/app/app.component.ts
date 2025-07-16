// File: projects/dockview-demo/src/app/app.component.ts

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { defaultConfig, nextId } from './default-layout';
import type { DockviewApi } from 'dockview-core';
import { DockviewContainerComponent } from 'angular-dockview';

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
export class AppComponent implements AfterViewInit {
  @ViewChild(DockviewContainerComponent, { static: true })
  dockview!: DockviewContainerComponent;

  events: EventLogEntry[] = [];
  showEvents = true;
  private counter = 0;
  private savedLayout = '';

  ngAfterViewInit(): void {
    const api: DockviewApi = this.dockview.api;
    defaultConfig(api);
    api.onDidAddGroup((evt) => this.log(`Group Added ${evt.id}`));
    api.onDidAddPanel((evt) => this.log(`Panel Added ${evt.id}`));
    api.onDidActiveGroupChange((evt) => this.log(`Group Activated ${evt.id}`));
    api.onDidActivePanelChange((evt) => this.log(`Panel Activated ${evt.id}`));
  }

  addPanel(): void {
    const id = `panel_${nextId()}`;
    this.dockview.api.addPanel({ id, component: 'default', title: id });
  }

  addNestedPanel(): void {
    const api = this.dockview.api;
    const active = api.activeGroup?.activePanel;
    const id = `panel_${nextId()}`;
    api.addPanel({
      id,
      component: 'default',
      title: id,
      position: { referencePanel: active! },
    });
  }

  addGroup(): void {
    const api = this.dockview.api;
    const active = api.activeGroup?.activePanel!;
    const id = `group_${nextId()}`;
    // Pass referencePanel and direction at top level as per AddGroupOptions signature
    api.addGroup({ id, referencePanel: active, direction: 'right' });
  }

  useCustomWatermark(): void {
    // cast to any to access setWatermark API
    (this.dockview.api as any).setWatermark('My Custom Watermark');
  }

  clear(): void {
    this.events = [];
  }

  save(): void {
    this.savedLayout = JSON.stringify(this.dockview.api.toJSON());
    this.log('Layout Saved');
  }

  load(): void {
    if (this.savedLayout) {
      this.dockview.api.fromJSON(JSON.parse(this.savedLayout));
      this.log('Layout Loaded');
    }
  }

  reset(): void {
    defaultConfig(this.dockview.api);
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
