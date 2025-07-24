import { Component, OnInit } from '@angular/core';
import { DataService, SalesRecord } from '../services/data.services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-sales-panel',
  templateUrl: './product-sales-panel.component.html',
  styleUrls: ['./product-sales-panel.component.css'],
})
export class ProductSalesPanelComponent implements OnInit {
  plotData: any[] = [];
  plotLayout: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService
      .getSalesData()
      .pipe(
        map((records: SalesRecord[]) => {
          const aggregated = { red: 0, yellow: 0, white: 0, blue: 0 };
          records.forEach((curr) => {
            aggregated.red += curr.red;
            aggregated.yellow += curr.yellow;
            aggregated.white += curr.white;
            aggregated.blue += curr.blue;
          });

          return {
            products: Object.keys(aggregated),
            totals: Object.values(aggregated),
          };
        })
      )
      .subscribe((data: { products: string[]; totals: number[] }) => {
        this.plotData = [
          {
            x: data.products,
            y: data.totals,
            type: 'bar',
            marker: { color: '#54a24b' },
          },
        ];

        this.plotLayout = {
          title: 'Sales by Product',
          xaxis: { title: 'Product' },
          yaxis: { title: 'Number of Sales' },
          margin: { t: 40, l: 50, r: 30, b: 60 },
        };
      });
  }
}
