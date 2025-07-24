import {
  Injectable,
  ApplicationRef,
  EmbeddedViewRef,
  Injector,
  ComponentFactoryResolver,
} from '@angular/core';
import {
  DockviewComponent,
  IContentRenderer,
  DockviewPanelApi,
  CreateComponentOptions,
  ITabRenderer,
  TabPartInitParameters,
  DockviewApi,
  GroupPanelPartInitParameters,
} from 'dockview-core';
import { PanelStateService } from './panel-state.service';
import { HeaderActionsService } from './header-actions.service';
import { RendererRegistryService } from './render-registry.service';
import { EventBusService } from './event-bus-service';
import { DockviewTabRendererComponent } from '../renderers/dockview-tab-renderer.component';

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

        const factory =
          this.componentFactoryResolver.resolveComponentFactory(componentType);
        const componentRef = factory.create(this.injector);
        this.injector.get(ApplicationRef).attachView(componentRef.hostView);

        return {
          element: (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0],
          init: (params: GroupPanelPartInitParameters) => {
            const headerActions = this.headerActionsService.getActions(
              options.name
            );
            params.api.updateParameters({ headerActions });
            this.panelStateService.setPanelActions(
              params.api.id,
              headerActions
            );

            if (params.params) {
              Object.assign(componentRef.instance, params.params);
            }
          },
          dispose: () => componentRef.destroy(),
        };
      },

      createTabComponent: (options: CreateComponentOptions): ITabRenderer => {
        const componentType = this.rendererRegistry.getTabRenderer(
          options.name || 'angularDefaultTab'
        );
        if (!componentType) {
          console.error(`No tab renderer found for ${options.name}`);
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

        return {
          element: (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0],
          init: (parameters: TabPartInitParameters) => {
            const headerActions = parameters.params?.['headerActions'] || [];
            console.log('middle of init for header', headerActions);
            componentRef.instance.title = parameters.title || options.id;
            componentRef.instance.headerActions = headerActions;
            componentRef.instance.panelApi = parameters.api;
            componentRef.changeDetectorRef.detectChanges();
          },
          dispose: () => componentRef.destroy(),
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
    this.dockviewApi.addPanel({
      id: config.id,
      title: config.title,
      component: config.component,
      position: config.position,
      tabComponent: 'angularDefaultTab',
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
