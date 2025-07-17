import {
  AfterViewInit,
  Component,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { DockviewComponent, DockviewComponentOptions } from 'dockview-core';
import { IDockviewPanel } from 'dockview-core';
import type { DockviewApi } from 'dockview-core';
import { DockviewDefaultTabRenderer } from '../../renderers/dockview-default-tab.renderer';
import type { IContentRenderer, CreateComponentOptions } from 'dockview-core';
import { DockviewService } from '../../services/dockview.service';

@Component({
  selector: 'adv-dockview-container',
  templateUrl: './dockview-container.component.html',
})
export class DockviewContainerComponent implements AfterViewInit {
  @ViewChild('dockviewHost', { static: true }) hostElement!: ElementRef;

  @Input() options?: Partial<DockviewComponentOptions>;

  @Output() initialized = new EventEmitter<DockviewApi>();
  @Output() panelFocused = new EventEmitter<string>();
  @Output() panelClosed = new EventEmitter<string>();
  @Output() panelAdded = new EventEmitter<string>();
  @Output() layoutChange = new EventEmitter<void>();

  private component!: DockviewComponent;

  constructor(private dockview: DockviewService) {}

  ngAfterViewInit(): void {
    this.component = new DockviewComponent(this.hostElement.nativeElement, {
      createTabComponent: () => new DockviewDefaultTabRenderer(),
      createComponent: this.createComponentRenderer(),
      disableAutoResizing: true,
    });

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

    this.initialized.emit(this.component.api);
  }

  // === PUBLIC API for demo integration ===

  addPanel(panelConfig: any): void {
    this.dockview.openPanel(panelConfig);
  }

  addNestedPanel(): void {
    // Example: add a panel using the currently active panel as reference
    const activePanel = this.component.activeGroup?.activePanel;
    if (activePanel) {
      const id = `panel_${Date.now()}`;
      this.dockview.openPanel({
        id,
        component: 'default',
        title: id,
        position: { referencePanel: activePanel },
      });
    }
  }

  addGroup(): void {
    // Example: add a new group to the right of the current group
    const activePanel = this.component.activeGroup?.activePanel;
    if (activePanel) {
      const id = `group_${Date.now()}`;
      this.component.api.addGroup({
        id,
        referencePanel: activePanel,
        direction: 'right',
      });
    }
  }

  setWatermark(watermark: string): void {
    if ((this.component.api as any).setWatermark) {
      (this.component.api as any).setWatermark(watermark);
    }
  }

  saveLayout(): string {
    return JSON.stringify(this.component.api.toJSON());
  }

  loadLayout(layout: string): void {
    if (layout) {
      this.component.api.fromJSON(JSON.parse(layout));
    }
  }

  reset(): void {
    // Simple default: remove all panels, then call defaultConfig if you want
    // You might want to expose a Subject/Callback for more complex logic
    while (this.component.panels.length > 0) {
      this.component.api.removePanel(this.component.panels[0]);
    }
    // Optionally, you could call your own defaultConfig function here
  }

  closePanel(panelId: string): void {
    this.dockview.closePanel(panelId);
  }

  focusPanel(panelId: string): void {
    this.dockview.focusPanel(panelId);
  }

  toggleFloat(panelId: string): void {
    this.dockview.toggleFloat(panelId);
  }

  private createComponentRenderer(): (
    options: CreateComponentOptions
  ) => IContentRenderer {
    return (_options: CreateComponentOptions): IContentRenderer => {
      const div = document.createElement('div');

      // THEME CLASS REMOVED FROM PANEL CONTENT

      div.textContent = '🧪 Default Angular Renderer Content';
      console.log('div', div);

      const renderer: IContentRenderer = {
        element: div,
        init: () => {
          console.log('[init] called for panel');
        },
        update: () => {
          console.log('[update] called for panel');
        },
        dispose: () => {
          console.log('[dispose] called for panel');
        },
      };

      // Augment dynamically with setActions
      (renderer as any).setActions = (actions: any[]) => {
        console.log('[setActions] received:', actions);
      };

      return renderer;
    };
  }
}
