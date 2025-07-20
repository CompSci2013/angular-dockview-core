import { Component, OnInit } from '@angular/core';
import { EventBusService } from 'angular-dockview';

@Component({
  selector: 'app-panel-two',
  templateUrl: './panel-two.component.html',
  styleUrls: ['./panel.css'],
})
export class PanelTwoComponent implements OnInit {
  lastFocusedPanel = '';
  latestMessage: string = '';

  constructor(private eventBus: EventBusService) {}

  ngOnInit() {
    this.eventBus.onPanelFocused().subscribe((panelId) => {
      this.lastFocusedPanel = panelId;
    });

    // Correctly subscribe to 'message' events specifically directed to PanelTwo
    this.eventBus.on().subscribe((event) => {
      if (event.type === 'message' && event.toPanelId === 'panelTwoComponent') {
        this.latestMessage = event.message;
        console.log('Panel Two received message:', event.message);
      }
    });
  }
}
