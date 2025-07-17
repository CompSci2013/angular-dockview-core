// FILE: projects/angulare-dockview/src/lib/angular-dockview.module.ts
import { NgModule } from '@angular/core';
import { AngularDockviewComponent } from './angular-dockview.component';
import { DockviewContainerComponent } from './angular-dockview/dockview-container/dockview-container.component';

@NgModule({
  declarations: [AngularDockviewComponent, DockviewContainerComponent],
  imports: [],
  exports: [
    AngularDockviewComponent,
    DockviewContainerComponent, // ▶️ export the container so <adv-dockview-container> is known
  ],
})
export class AngularDockviewModule {}
