/** This service centralizes all interaction with Dockview’s core API.
 *  It makes future testing, state syncing, and extensions (e.g. event dispatching) much easier.
 * */

import {
  Injectable,
  ApplicationRef,
  EmbeddedViewRef,
  ComponentRef,
} from '@angular/core';
import { DockviewComponent } from 'dockview-core';
import { IContentRenderer } from 'dockview-core/dist/cjs/dockview/types';
import { PanelStateService, PanelState } from './panel-state.service';
import { HeaderActionsService } from './header-actions.service';
import { RendererRegistryService } from './render-registry.service';
import { Injector } from '@angular/core';
import {
  CreateComponentOptions,
  ITabRenderer,
  TabPartInitParameters,
  DockviewPanelApi,
  DockviewApi,
} from 'dockview-core';
import { group } from 'console';

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

      // Existing imports remain unchanged

      createComponent: (options: CreateComponentOptions) => {
        console.log(
          '[DockviewService] createComponent called for:',
          options.name
        );

        const componentType = this.rendererRegistry.getPanelRenderer(
          options.name
        );
        let compnentRef: ComponentRef<any> | null = null;
        if (!componentType) {
          console.error(`No renderer found for ${options.name}`);
          return {
            element: document.createElement('div'),
            init: () => {},
            dispose: () => {},
          };
        }

        const componentRef: ComponentRef<any> = this.injector
          .get(ApplicationRef)
          .bootstrap(componentType);

        const panelElement = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0];

        return {
          element: panelElement,

          init: (params: { api: DockviewPanelApi; params?: any }) => {
            const panelId = params.api?.id ?? '[unknown]';
            console.log(
              `[DockviewService] init called for panelId: ${panelId}`
            );

            // Your existing Popout and Close button logic clearly preserved:
            const headerActions = [
              {
                id: 'popout',
                label: 'Popout',
                icon: 'codicon codicon-browser',
                tooltip: 'Open in Floating Window',
                command: (panelApi: DockviewPanelApi) => {
                  console.log(
                    `[DockviewService] Popout clicked for panelId: ${panelId}`
                  );
                  const dockviewApi = this.dockviewApi;
                  const newGroup = dockviewApi.addGroup({
                    referencePanel: panelApi.id,
                    direction: 'right',
                  });
                  panelApi.moveTo({ group: newGroup });
                  dockviewApi.addPopoutGroup(newGroup, {
                    position: { width: 800, height: 600, left: 100, top: 100 },
                    popoutUrl: '/assets/popout.html',
                  });
                },
                run: () => {},
              },
              {
                id: 'close',
                label: 'Close',
                icon: 'codicon codicon-close',
                tooltip: 'Close Panel',
                command: (panelApi: DockviewPanelApi) => {
                  const panel = this.dockviewApi.getPanel(panelApi.id);
                  if (panel) {
                    this.dockviewApi.removePanel(panel);
                  }
                },
                run: () => {},
              },
            ];

            params.api.updateParameters({ headerActions });
            this.panelStateService.setPanelActions(panelId, headerActions);

            // Pass panel params directly as inputs to your Angular component
            if (params.params) {
              Object.assign(componentRef.instance, params.params);
            }
          },

          dispose: () => {
            componentRef.destroy();
          },
        };
      },

      createTabComponent: (options: CreateComponentOptions): ITabRenderer => {
        const element = document.createElement('div');
        element.classList.add('custom-tab');

        let actionsContainer: HTMLElement;
        let titleSpan: HTMLElement;

        return {
          element,

          init: (parameters: TabPartInitParameters): void => {
            titleSpan = document.createElement('span');
            titleSpan.textContent = parameters.title || options.id;
            titleSpan.classList.add('custom-tab-title');
            element.appendChild(titleSpan);

            actionsContainer = document.createElement('div');
            actionsContainer.classList.add('custom-tab-actions');
            element.appendChild(actionsContainer);

            const renderActions = (actions: Array<any>) => {
              actionsContainer.innerHTML = '';
              actions.forEach((action) => {
                const button = document.createElement('button');
                button.className = `dockview-tab-action ${action.icon}`;
                button.title = action.tooltip;
                button.onclick = (e) => {
                  e.stopPropagation();
                  action.command(parameters.api);
                };
                actionsContainer.appendChild(button);
              });
            };

            parameters.api.onDidParametersChange((event) => {
              const actions = event['params']?.['headerActions'] || [];

              renderActions(actions);
            });

            // Initial rendering of headerActions
            const initialActions = parameters.params?.['headerActions'] || [];
            renderActions(initialActions);
          },

          dispose: () => {
            element.remove();
          },
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
        command: (panelApi: DockviewPanelApi) => {
          const dockviewApi = this.dockviewApi;
          const panelId = panelApi.id;

          const newGroup = dockviewApi.addGroup({
            referencePanel: panelApi.id,
            direction: 'right',
          });
          panelApi.moveTo({ group: newGroup });

          dockviewApi
            .addPopoutGroup(newGroup, {
              position: {
                width: 800,
                height: 600,
                left: 100,
                top: 100,
              },
              popoutUrl: '/popout.html',
              onDidOpen: ({ id, window }) => {},
              onWillClose: ({ id, window }) => {},
            })
            .then((success) => {
              if (success) {
                console.log('Pop!');
              } else {
                console.error(
                  `Failed to open popout window for panel ${panelId}.`
                );
              }
            });
          console.log(`Panel ${panelApi.id} popped out successfully.`);
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
      tabComponent: 'default',
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
