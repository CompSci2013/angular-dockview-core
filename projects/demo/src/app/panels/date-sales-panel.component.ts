import { Component, OnInit } from '@angular/core';
import { DataService, SalesRecord } from '../services/data.services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-date-sales-panel',
  templateUrl: './date-sales-panel.component.html',
})
export class DateSalesPanelComponent implements OnInit {
  plotData: any[] = [];
  plotLayout: any = {};

  constructor(private dataService: DataService) {}

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
          },
        ];

        this.plotLayout = {
          title: 'Sales by Date',
          xaxis: { title: 'Date' },
          yaxis: { title: 'Number of Sales' },
          margin: { t: 40, l: 50, r: 30, b: 60 },
        };
      });
  }
}
