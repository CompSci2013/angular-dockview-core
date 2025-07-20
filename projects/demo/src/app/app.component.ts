// FILE: projects/demo/src/app/app.component.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import {
  DockviewContainerComponent,
  RendererRegistryService,
} from 'angular-dockview';
import { defaultConfig, nextId } from './default-layout';
import { PanelOneComponent } from './panels/panel-one.component';
import { PanelTwoComponent } from './panels/panel-two.component';

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
export class AppComponent implements OnInit {
  @ViewChild('dockview', { static: true })
  dockview!: DockviewContainerComponent;

  events: EventLogEntry[] = [];
  showEvents = true;
  private counter = 0;
  private savedLayout = '';

  ngOnInit(): void {
    this.rendererRegistry.registerPanelRenderer(
      'panelOneComponent',
      PanelOneComponent
    );
    this.rendererRegistry.registerPanelRenderer(
      'panelTwoComponent',
      PanelTwoComponent
    );
  }

  constructor(private rendererRegistry: RendererRegistryService) {}

  /**
   * Called when <adv-dockview-container> emits (initialized).
   * The $event is the instance of DockviewContainerComponent.
   */
  onReady(_api: any): void {
    // this.reset();
    defaultConfig(this.dockview);
    // You can hook up event subscriptions here if needed
  }

  addPanel(): void {
    const id = nextId();
    this.dockview.addPanel({
      id: `Panel_${id}`,
      component: 'default',
      title: `Panel ${id}`,
      // You may add inputs/headerActions if needed
    });
    this.log(`Add Panel ${id}`);
  }

  addNestedPanel(): void {
    // Implement if your wrapper exposes such method
  }

  addGroup(): void {
    // Implement if your wrapper exposes such method
  }

  useCustomWatermark(): void {
    // Implement if your wrapper exposes setWatermark()
  }

  clear(): void {
    this.events = [];
  }

  save(): void {
    // Implement if your wrapper exposes a saveLayout method
    this.log('Layout Saved');
  }

  load(): void {
    // Implement if your wrapper exposes a loadLayout method
    this.log('Layout Loaded');
  }

  reset(): void {
    // Could call a method to reset dockview, if wrapper exposes one
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
