import { Component, OnInit } from '@angular/core';
import { EventBusService } from 'angular-dockview';

@Component({
  selector: 'app-panel-two',
  template: `Last focused panel: {{ lastFocusedPanel }}`,
})
export class PanelTwoComponent implements OnInit {
  lastFocusedPanel = '';

  constructor(private eventBus: EventBusService) {}

  ngOnInit() {
    // Custom event subscription defined only in D, no leak
    this.eventBus.onPanelFocused().subscribe((panelId) => {
      this.lastFocusedPanel = panelId;
    });
  }
}
