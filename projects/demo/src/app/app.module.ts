// File: projects/demo/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// ▶️ NEW: Import local AngularDockview library
import { AngularDockviewModule } from 'angular-dockview';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularDockviewModule, // ▶️ Added the wrapper module here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
