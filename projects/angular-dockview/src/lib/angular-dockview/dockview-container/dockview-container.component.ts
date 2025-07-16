// FILE: projects/angular-dockview/src/lib/angular-dockview/dockview-container/dockview-container.oomponent.ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { DockviewComponent } from 'dockview-core';
import { IDockviewPanel } from 'dockview-core';
import { AngularDockviewService } from '../../angular-dockview.service';
import type { DockviewApi } from 'dockview-core'; // ← add near other imports if not already present

@Component({
  selector: 'adv-dockview-container',
  templateUrl: './dockview-container.component.html',
  styleUrls: ['./dockview-container.component.css'],
})
export class DockviewContainerComponent implements AfterViewInit {
  @ViewChild('dockviewHost', { static: true }) hostElement!: ElementRef;

  @Output() initialized = new EventEmitter<DockviewApi>();
  @Output() panelFocused = new EventEmitter<string>();
  @Output() panelClosed = new EventEmitter<string>();
  @Output() panelAdded = new EventEmitter<string>();
  @Output() layoutChange = new EventEmitter<void>();

  private component!: DockviewComponent;

  constructor(private dockview: AngularDockviewService) {}

  ngAfterViewInit(): void {
    this.component = new DockviewComponent(this.hostElement.nativeElement, {
      createTabComponent: this.createTabComponent(),
      createComponent: this.createComponentRenderer(),
      disableAutoResizing: true,
    });

    // FIX: Send the DockviewApi instead of DockviewComponent
    this.dockview.setApi(this.component.api);

    this.component.onDidAddPanel((panel: IDockviewPanel) => {
      this.panelAdded.emit(panel.id);
    });

    this.component.onDidRemovePanel((panel: IDockviewPanel) => {
      this.panelClosed.emit(panel.id);
    });

    this.component.onDidActivePanelChange(
      (panel: IDockviewPanel | undefined) => {
        if (panel) {
          this.panelFocused.emit(panel.id);
        }
      }
    );

    this.component.onDidLayoutChange(() => {
      this.layoutChange.emit();
    });

    // ✅ Fix here — emit the DockviewApi
    this.initialized.emit(this.component.api);
  }

  private createTabComponent() {
    return () => {
      return {
        element: document.createElement('div'),
        init: () => {},
        update: () => {},
        dispose: () => {},
      };
    };
  }

  private createComponentRenderer() {
    return () => {
      return {
        element: document.createElement('div'),
        init: () => {},
        update: () => {},
        dispose: () => {},
      };
    };
  }
}
