// File: projects/demo/src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateSalesPanelComponent } from './panels/date-sales-panel.component';
import { CompanySalesPanelComponent } from './panels/company-sales-panel.component';
import { ProductSalesPanelComponent } from './panels/product-sales-panel.component';
import { PlotlyChartComponent } from './shared/plotly-chart/plotly-chart.component';

// ← Import the wrapper library’s module
import { AngularDockviewModule } from 'angular-dockview';

@NgModule({
  declarations: [
    AppComponent,
    DateSalesPanelComponent,
    CompanySalesPanelComponent,
    ProductSalesPanelComponent,
    PlotlyChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularDockviewModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
