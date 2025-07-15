// demo/src/app/app.component.ts

import { Component } from '@angular/core';
import { SplitviewPanel, CreateComponentOptions } from 'dockview-core';

@Component({
  selector: 'app-root',
  template: `
    <adv-dockview-container
      [options]="{ className: 'my-splitview' }"
      [createComponent]="panelFactory"
    ></adv-dockview-container>
  `,
})
export class AppComponent {
  /**
   * The createComponent callback must:
   *  - accept CreateComponentOptions { id, name }
   *  - return a concrete SplitviewPanel with getComponent() implemented
   */
  panelFactory = (opts: CreateComponentOptions) => {
    // Subclass the abstract SplitviewPanel at runtime
    class AngularSplitviewPanel extends (SplitviewPanel as any) {
      constructor() {
        // Use opts.name (not opts.component)
        super(opts.id, opts.name);
      }

      /**
       * Implement the abstract method from BasePanelView:
       * return the HTMLElement to be inserted for this panel.
       */
      getComponent(): HTMLElement {
        const el = document.createElement('div');
        el.style.width = '100%';
        el.style.height = '100%';
        // You could attach an Angular view here if needed.
        return el;
      }
    }

    return new AngularSplitviewPanel();
  };
}
