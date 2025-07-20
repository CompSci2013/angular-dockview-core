// FILE: projects/demo/src/app/app.component.ts

import { Component, ViewChild, OnInit } from '@angular/core';
import {
  DockviewContainerComponent,
  RendererRegistryService,
} from 'angular-dockview';
import { defaultConfig, nextId } from './default-layout';
import { PanelOneComponent } from './panels/panel-one.component';
import { PanelTwoComponent } from './panels/panel-two.component';
import { DefaultPanelComponent } from './panels/default-panel.component';
import { EventBusService, HeaderActionsService } from 'angular-dockview';

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
      'default',
      DefaultPanelComponent
    );
    this.rendererRegistry.registerPanelRenderer(
      'panelOneComponent',
      PanelOneComponent
    );
    this.rendererRegistry.registerPanelRenderer(
      'panelTwoComponent',
      PanelTwoComponent
    );

    // Example: Add extra actions for a specific panel
    const defaultActions =
      this.headerActionsService.getActions('panelOneComponent');

    this.headerActionsService.registerActions('panelOneComponent', [
      ...defaultActions,
      {
        id: 'notify',
        label: 'Notify',
        icon: 'codicon codicon-bell',
        tooltip: 'Notify something',
        command: (panelApi) => {
          this.eventBus.emit({
            type: 'log',
            message: `Notify clicked on ${panelApi.id}`,
            source: panelApi.id,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
      },
    ]);
  }

  constructor(
    private rendererRegistry: RendererRegistryService,
    private headerActionsService: HeaderActionsService,
    private eventBus: EventBusService
  ) {}

  /**
   * Called when <adv-dockview-container> emits (initialized).
   * The $event is the instance of DockviewContainerComponent.
   */
  onReady(_api: any): void {
    defaultConfig(this.dockview);

    // Explicitly add richer panels with Angular content
    this.dockview.addPanel({
      id: 'rich_panel_1',
      component: 'panelOneComponent',
      title: 'Rich Panel One',
      inputs: {
        headerActions: [], // Adjust as needed later
      },
    });

    this.dockview.addPanel({
      id: 'rich_panel_2',
      component: 'panelTwoComponent',
      title: 'Rich Panel Two',
      inputs: {
        headerActions: [], // Adjust as needed later
      },
    });
  }

  addPanel(): void {
    const id = nextId();
    this.dockview.addPanel({
      id,
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
