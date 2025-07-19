// FILE: projects/angulare-dockview/src/lib/angular-dockview.module.ts
import { NgModule } from '@angular/core';
import { AngularDockviewComponent } from './angular-dockview.component';
import { DockviewContainerComponent } from './angular-dockview/dockview-container/dockview-container.component';
import { DockviewTabRendererComponent } from './renderers/dockview-tab-renderer.component';

@NgModule({
  declarations: [
    AngularDockviewComponent,
    DockviewContainerComponent,
    DockviewTabRendererComponent,
  ],
  imports: [],
  exports: [
    AngularDockviewComponent,
    DockviewContainerComponent,
    DockviewTabRendererComponent,
  ],
})
export class AngularDockviewModule {}
