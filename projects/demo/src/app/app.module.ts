// File: projects/demo/src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateSalesPanelComponent } from './panels/date-sales-panel.component';

// ← Import the wrapper library’s module
import { AngularDockviewModule } from 'angular-dockview';

@NgModule({
  declarations: [AppComponent, DateSalesPanelComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularDockviewModule, // ← add here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
