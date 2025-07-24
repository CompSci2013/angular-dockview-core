import { Component, OnInit } from '@angular/core';
import { DataService, SalesRecord } from '../services/data.services';
import { map } from 'rxjs/operators';
import { EventBusService } from 'angular-dockview';

@Component({
  selector: 'app-date-sales-panel',
  templateUrl: './date-sales-panel.component.html',
})
export class DateSalesPanelComponent implements OnInit {
  plotData: any[] = [];
  plotLayout: any = {};

  constructor(
    private dataService: DataService,
    private eventBus: EventBusService
  ) {}

  ngOnInit(): void {
    this.dataService
      .getSalesData()
      .pipe(
        map((records) => {
          const aggregated = records.reduce((acc, curr) => {
            acc[curr.date] =
              (acc[curr.date] || 0) +
              curr.red +
              curr.yellow +
              curr.white +
              curr.blue;
            return acc;
          }, {} as { [key: string]: number });

          return {
            dates: Object.keys(aggregated),
            totals: Object.values(aggregated),
          };
        })
      )
      .subscribe((data) => {
        this.plotData = [
          {
            x: data.dates,
            y: data.totals,
            type: 'bar',
            marker: { color: '#4c78a8' },
            hoverinfo: 'x+y',
            hovertemplate: 'Date: %{x}<br>Sales: %{y}<extra></extra>',
          },
        ];

        this.plotLayout = {
          title: 'Sales by Date',
          xaxis: { title: 'Date' },
          yaxis: { title: 'Number of Sales' },
          margin: { t: 40, l: 50, r: 30, b: 60 },
        };

        // Attach Plotly hover events after chart is rendered
        setTimeout(() => {
          const plotElement = document.querySelector(
            'app-date-sales-panel app-plotly-chart .plotly-chart'
          ) as any;

          if (plotElement && plotElement.on) {
            plotElement.on('plotly_hover', (eventData: any) => {
              const hoveredDate = eventData.points[0].x;
              console.log(
                '[DateSalesPanel] Emitting hover event:',
                hoveredDate
              );
              this.eventBus.emit({
                type: 'message',
                toPanelId: 'all',
                message: hoveredDate,
              });
            });

            plotElement.on('plotly_unhover', () => {
              console.log('[DateSalesPanel] Emitting unhover event (null)');
              this.eventBus.emit({
                type: 'message',
                toPanelId: 'all',
                message: '',
              });
            });
          }
        }, 0);
      });
  }
}
