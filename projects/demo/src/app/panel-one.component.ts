import { Component } from '@angular/core';
import { EventBusService } from 'angular-dockview';

@Component({
  selector: 'app-panel-one',
  template: `<button (click)="notify()">Notify Panel Two</button>`,
})
export class PanelOneComponent {
  constructor(private eventBus: EventBusService) {}

  notify() {
    // Custom event defined only in D, no abstraction leak
    this.eventBus.emit({ type: 'panelFocused', panelId: 'panel_1' });
  }
}
