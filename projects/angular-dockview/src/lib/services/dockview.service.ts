/**
 * This service centralizes all interaction with Dockview’s core API.
 * It makes future testing, state syncing, and extensions (e.g., event dispatching) much easier.
 */

import {
  Injectable,
  ApplicationRef,
  EmbeddedViewRef,
  ComponentRef,
  Injector,
  ComponentFactoryResolver,
} from '@angular/core';
import {
  DockviewComponent,
  IContentRenderer,
  IDockviewPanel,
  CreateComponentOptions,
  ITabRenderer,
  TabPartInitParameters,
  DockviewApi,
  GroupPanelPartInitParameters,
  DockviewPanelApi,
} from 'dockview-core';
import { PanelStateService, PanelState } from './panel-state.service';
import { HeaderActionsService, HeaderAction } from './header-actions.service';
import { RendererRegistryService } from './render-registry.service';
import { EventBusService } from './event-bus-service';

@Injectable({ providedIn: 'root' })
export class DockviewService {
  private dockviewComponent!: DockviewComponent;
  private dockviewApi!: DockviewApi;

  constructor(
    private panelStateService: PanelStateService,
    private headerActionsService: HeaderActionsService,
    private rendererRegistry: RendererRegistryService,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private eventBus: EventBusService
  ) {}

  initialize(container: HTMLElement, theme: string): DockviewApi {
    if (theme) {
      container.classList.add(theme);
    }

    this.dockviewComponent = new DockviewComponent(container, {
      disableAutoResizing: false,
      floatingGroupBounds: 'boundedWithinViewport',

      createComponent: (options: CreateComponentOptions): IContentRenderer => {
        const componentType = this.rendererRegistry.getPanelRenderer(
          options.name
        );

        if (!componentType) {
          console.error(`No renderer found for ${options.name}`);
          return {
            element: document.createElement('div'),
            init: () => {},
            dispose: () => {},
          };
        }

        const componentFactory =
          this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = componentFactory.create(this.injector);
        this.injector.get(ApplicationRef).attachView(componentRef.hostView);

        const panelElement = (componentRef.hostView as EmbeddedViewRef<any>)
          .rootNodes[0];

        return {
          element: panelElement,

          init: (parameters: GroupPanelPartInitParameters) => {
            const panelId = parameters.api.id;

            const headerActions: HeaderAction[] = [
              {
                id: 'popout',
                label: 'Popout',
                icon: 'codicon codicon-browser',
                tooltip: 'Open in Floating Window',
                command: (
                  panelApi: IDockviewPanel,
                  dockviewApi?: DockviewApi
                ) => {
                  if (!dockviewApi) return;
                  const newGroup = dockviewApi.addGroup({
                    referencePanel: panelApi.id,
                    direction: 'right',
                  });
                  (panelApi as any).moveTo({ group: newGroup });
                  dockviewApi.addPopoutGroup(newGroup, {
                    position: { width: 800, height: 600, left: 100, top: 100 },
                    popoutUrl: '/assets/popout.html',
                  });
                },
              },
              {
                id: 'close',
                label: 'Close',
                icon: 'codicon codicon-close',
                tooltip: 'Close Panel',
                command: (
                  panelApi: IDockviewPanel,
                  dockviewApi?: DockviewApi
                ) => {
                  if (!dockviewApi) return;
                  dockviewApi.removePanel(panelApi);
                },
              },
            ];

            parameters.api.updateParameters({ headerActions });
            this.panelStateService.setPanelActions(panelId, headerActions);

            if (parameters.params) {
              Object.assign(componentRef.instance, parameters.params);
            }
          },

          dispose: () => componentRef.destroy(),
        };
      },

      createTabComponent: (options: CreateComponentOptions): ITabRenderer => {
        const element = document.createElement('div');
        element.classList.add('custom-tab');

        return {
          element,
          init: (parameters: TabPartInitParameters) => {
            element.innerHTML = `<span class="custom-tab-title">${
              parameters.title || options.id
            }</span><div class="custom-tab-actions"></div>`;
            const actionsContainer = element.querySelector(
              '.custom-tab-actions'
            ) as HTMLElement;

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
              renderActions(event['params']?.['headerActions'] || []);
            });

            renderActions(parameters['params']?.['headerActions'] || []);
          },

          dispose: () => element.remove(),
        };
      },
    });

    this.dockviewApi = this.dockviewComponent.api;
    return this.dockviewApi;
  }

  dispose(): void {
    this.dockviewComponent.dispose();
  }

  addPanel(config: any): void {
    const headerActions = this.headerActionsService.getActions(
      config.component
    );
    const panel = this.dockviewApi.addPanel({
      id: config.id,
      title: config.title,
      component: config.component,
      position: config.position,
      params: { ...(config.inputs || {}), headerActions },
    });

    this.panelStateService.addPanel({
      id: config.id,
      title: config.title,
      active: true,
      floating: false,
      headerActions,
    });
  }

  focusPanel(id: string): void {
    this.dockviewApi.getPanel(id)?.focus();
    this.panelStateService.activatePanel(id);
  }
}
