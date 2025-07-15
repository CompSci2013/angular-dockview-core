import { NgModule } from '@angular/core';
import { AngularDockviewComponent } from './angular-dockview.component';
import { DockviewContainerComponent } from './angular-dockview/dockview-container/dockview-container.component';



@NgModule({
  declarations: [
    AngularDockviewComponent,
    DockviewContainerComponent
  ],
  imports: [
  ],
  exports: [
    AngularDockviewComponent
  ]
})
export class AngularDockviewModule { }
