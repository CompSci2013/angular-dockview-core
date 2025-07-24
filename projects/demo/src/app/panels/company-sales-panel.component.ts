import { Component, OnInit } from '@angular/core';
import { DataService, SalesRecord } from '../services/data.services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-company-sales-panel',
  templateUrl: './company-sales-panel.component.html',
  styleUrls: ['./company-sales-panel.component.css'],
})
export class CompanySalesPanelComponent implements OnInit {
  plotData: any[] = [];
  plotLayout: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService
      .getSalesData()
      .pipe(
        map((records: SalesRecord[]) => {
          const aggregated = records.reduce(
            (acc: { [key: string]: number }, curr: SalesRecord) => {
              const total = curr.red + curr.yellow + curr.white + curr.blue;
              acc[curr.company] = (acc[curr.company] || 0) + total;
              return acc;
            },
            {}
          );

          return {
            companies: Object.keys(aggregated),
            totals: Object.values(aggregated),
          };
        })
      )
      .subscribe((data: { companies: string[]; totals: number[] }) => {
        this.plotData = [
          {
            x: data.companies,
            y: data.totals,
            type: 'bar',
            marker: { color: '#f58518' },
          },
        ];

        this.plotLayout = {
          title: 'Sales by Company',
          xaxis: { title: 'Company' },
          yaxis: { title: 'Number of Sales' },
          margin: { t: 40, l: 50, r: 30, b: 60 },
        };
      });
  }
}
