// File: projects/demo/src/app/app.component.ts
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  CreateComponentOptions,
  IContentRenderer,
  DockviewApi,
} from 'dockview-core';
import { DockviewContainerComponent } from 'angular-dockview';

@Component({
  selector: 'app-root',
  template: `
    <adv-dockview-container
      [options]="{ className: 'my-dockview' }"
      [createComponent]="panelFactory"
    ></adv-dockview-container>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild(DockviewContainerComponent, { static: true })
  private container!: DockviewContainerComponent;

  /**
   * CreateComponent callback for Dockview.
   * Returns an IContentRenderer with element and init hook.
   */
  panelFactory = (opts: CreateComponentOptions): IContentRenderer => {
    const element = document.createElement('div');
    element.style.width = '100%';
    element.style.height = '100%';

    return {
      element,
      init: (_: any) => {
        // Panel-level initialization (no parameters needed)
      },
    };
  };

  ngAfterViewInit(): void {
    // Add initial panels via the container's exposed API
    const api: DockviewApi = this.container.api;
    api.addPanel({ id: 'panel-1', component: 'panel-1', title: 'First Panel' });
    api.addPanel({
      id: 'panel-2',
      component: 'panel-2',
      title: 'Second Panel',
    });
  }
}
