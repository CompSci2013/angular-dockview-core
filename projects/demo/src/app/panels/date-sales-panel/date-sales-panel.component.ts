// Dockview-specific wrapper component
@Component({
  selector: 'app-date-sales-panel',
  template: `
    <app-histogram
      [plotData]="data"
      plotSelector=".histogram-chart"
      (hovered)="onHovered($event)"
      (clicked)="onClicked($event)"
      (selected)="onSelected($event)"
      (zoomed)="onZoomed($event)"
      (cleared)="onCleared()"
    ></app-histogram>
  `,
})
export class DateSalesPanelComponent {
  constructor(private eventBus: EventBusService) {}

  onHovered(date: string) {
    this.eventBus.emit({ type: 'message', toPanelId: 'all', message: date });
  }

  onClicked(date: string) {
    this.eventBus.emit({ type: 'message', toPanelId: 'filter', message: date });
  }

  onSelected(dates: string[]) {
    this.eventBus.emit({
      type: 'message',
      toPanelId: 'multi-filter',
      message: dates,
    });
  }

  onZoomed(range: [string, string]) {
    this.eventBus.emit({ type: 'message', toPanelId: 'zoom', message: range });
  }

  onCleared() {
    this.eventBus.emit({ type: 'message', toPanelId: 'filter', message: '' });
  }
}
