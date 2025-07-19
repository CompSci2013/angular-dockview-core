/** This service centralizes all interaction with Dockview’s core API.
 *  It makes future testing, state syncing, and extensions (e.g. event dispatching) much easier.
 * */

import { Injectable } from '@angular/core';
import { DockviewComponent } from 'dockview-core';
import { DockviewApi } from 'dockview-core/dist/cjs/api/component.api';
import { IContentRenderer } from 'dockview-core/dist/cjs/dockview/types';
import { PanelStateService, PanelState } from './panel-state.service';
import { HeaderActionsService } from './header-actions.service';
import { RendererRegistryService } from './render-registry.service';
import { Injector } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DockviewService {
  private dockviewComponent!: DockviewComponent;
  private dockviewApi!: DockviewApi;

  constructor(
    private panelStateService: PanelStateService,
    private headerActionsService: HeaderActionsService,
    private rendererRegistry: RendererRegistryService,
    private injector: Injector
  ) {}

  initialize(container: HTMLElement, theme: string): DockviewApi {
    if (theme) {
      container.classList.add(theme);
    }

    this.dockviewComponent = new DockviewComponent(container, {
      disableAutoResizing: false,
      floatingGroupBounds: 'boundedWithinViewport',
      // UPDATED: createComponent block now injects header actions via Dockview's API with debug logging
      createComponent: (options) => {
        console.log(
          '[DockviewService] createComponent called for:',
          options.name
        );
        return {
          element: document.createElement('div'),
          init: (params) => {
            const panelId = params.api?.id ?? '[unknonw]';
            console.log(
              `[DockviewService] init called for panelId: ${panelId}`
            );

            // Define Popout and Close actions for Dockview to inject
            const headerActions = [
              {
                id: 'popout',
                label: 'Popout',
                icon: 'codicon codicon-browser',
                tooltip: 'Open in Floating Window',
                command: (panelApi: any) => {
                  console.log(
                    `[DockviewService] Popout clicked for panelId: ${panelId}`
                  );
                  panelApi.popout?.();
                },
                run: () => {},
              },
              {
                id: 'close',
                label: 'Close',
                icon: 'codicon codicon-close',
                tooltip: 'Close Panel',
                command: (panelApi: any) => {
                  console.log(
                    `[DockviewService] Close clicked for panelId: ${panelId}`
                  );
                  this.dockviewApi.removePanel(panelApi);
                },
                run: () => {},
              },
            ];

            console.log(
              `[DockviewService] Injecting headerActions for panelId: ${panelId}`,
              headerActions
            );

            // Apply the actions via Dockview's API
            params.api.updateParameters({ headerActions });

            // Persist them in state for access later
            this.panelStateService.setPanelActions(panelId, headerActions);
          },
          update: () => {},
          dispose: () => {},
        };
      },
    });

    this.dockviewApi = this.dockviewComponent.api;
    return this.dockviewApi;
  }

  dispose(): void {
    this.dockviewComponent?.dispose();
  }

  addPanel(config: any): void {
    const headerActions = [
      {
        id: 'popout',
        label: 'Popout',
        icon: 'codicon codicon-browser',
        tooltip: 'Open in Floating Window',
        command: (panelApi: any) => {
          console.log(
            `[DockviewService] Popout clicked for panelId: ${config.id}`
          );
          panelApi.popout?.();
        },
        run: () => {},
      },
      {
        id: 'close',
        label: 'Close',
        icon: 'codicon codicon-close',
        tooltip: 'Close Panel',
        command: (panelApi: any) => {
          console.log(
            `[DockviewService] Close clicked for panelId: ${config.id}`
          );
          this.dockviewApi.removePanel(panelApi);
        },
        run: () => {},
      },
    ];

    const panel = this.dockviewApi.addPanel({
      id: config.id,
      title: config.title,
      component: config.component,
      position: config.position,
      params: {
        ...(config.inputs || {}),
        headerActions,
      },
    });

    const state: PanelState = {
      id: config.id,
      title: config.title,
      active: true,
      floating: false,
      headerActions,
    };

    this.panelStateService.addPanel(state);
  }

  focusPanel(id: string): void {
    this.dockviewApi?.getPanel(id)?.focus();
    this.panelStateService.activatePanel(id);
  }
}
