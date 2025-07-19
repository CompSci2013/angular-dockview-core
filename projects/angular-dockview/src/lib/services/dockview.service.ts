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
      createComponent: (options) => {
        const RendererComponent = this.rendererRegistry.getTabRenderer(
          options.name
        );

        if (!RendererComponent) {
          console.warn(`No renderer found for ${options.name}`);
          return {
            element: document.createElement('div'),
            init: () => {},
            update: () => {},
            dispose: () => {},
          };
        }

        // Use Angular 13+ dynamic creation API
        const container = document.createElement('div');

        const refHost = document.createElement('div');
        container.appendChild(refHost);

        const componentRef = new RendererComponent();
        const element = document.createElement('div');
        container.appendChild(element);

        // We'll manually wire this in after we support container injection or embed into real Angular view trees
        return {
          element: container,
          init: (params) => {
            componentRef.title = params.title ?? '';
            componentRef.headerActions = params.params?.['headerActions'] ?? [];

            componentRef.actionClicked?.subscribe((action: any) => {
              action.command?.(params.api);
            });
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
    const panel = this.dockviewApi.addPanel({
      id: config.id,
      title: config.title,
      component: config.component,
      position: config.position,
      params: {
        ...(config.inputs || {}),
        headerActions:
          config.headerActions ?? this.headerActionsService.getDefaultActions(),
      },
    });

    const state: PanelState = {
      id: config.id,
      title: config.title,
      active: true,
      floating: false,
    };

    this.panelStateService.addPanel(state);
  }

  focusPanel(id: string): void {
    this.dockviewApi?.getPanel(id)?.focus();
    this.panelStateService.activatePanel(id);
  }
}
