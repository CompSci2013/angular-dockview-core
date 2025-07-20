import { Component } from '@angular/core';
import { EventBusService } from 'angular-dockview';

@Component({
  selector: 'app-panel-one',
  templateUrl: './panel-one.component.html',
  styleUrls: ['./panel.css'],
})
export class PanelOneComponent {
  constructor(private eventBus: EventBusService) {}

  notify() {
    // Custom event defined only in D, no abstraction leak
    this.eventBus.emit({ type: 'panelFocused', panelId: 'panel_1' });
  }

  publish(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.value != null) {
      this.eventBus.emit({
        type: 'message',
        toPanelId: 'panelTwoComponent',
        message: input.value, // <-- correctly sending input value
      });
    }
  }
}
