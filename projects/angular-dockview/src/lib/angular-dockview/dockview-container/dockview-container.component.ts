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
import type { IContentRenderer, CreateComponentOptions } from 'dockview-core';

// --- PATCH: Import services ---
import { DockviewService } from '../../services/dockview.service';
import { PanelRegistryService } from '../../services/panel-registry.service';
import { RendererRegistryService } from '../../services/render-registry.service';

// If you have a default tab renderer class, import it here
// import { DockviewDefaultTabRenderer } from '../../renderers/dockview-default-tab.renderer';

@Component({
  selector: 'adv-dockview-container',
  templateUrl: './dockview-container.component.html',
})
export class DockviewContainerComponent implements AfterViewInit {
  @ViewChild('dockviewHost', { static: true }) hostElement!: ElementRef;

  // Only allow switching themes from the host; don't leak options object!
  @Input() theme: string = 'dockview-theme-vs-dark';

  @Output() initialized = new EventEmitter<DockviewApi>();
  @Output() panelFocused = new EventEmitter<string>();
  @Output() panelClosed = new EventEmitter<string>();
  @Output() panelAdded = new EventEmitter<string>();
  @Output() layoutChange = new EventEmitter<void>();

  private component!: DockviewComponent;

  // --- PATCH: Inject registry services ---
  constructor(
    private dockview: DockviewService,
    private panelRegistry: PanelRegistryService,
    private renderRegistry: RendererRegistryService
  ) {}

  ngAfterViewInit(): void {
    // Apply the theme to the host container
    if (this.hostElement && this.hostElement.nativeElement) {
      this.hostElement.nativeElement.className = this.theme;
    }

    // --- PATCH: Register default panel and renderer keys ---
    // panelRegistry.register('default', DefaultPanelComponent);
    // renderRegistry.register('defaultTab', DockviewDefaultTabRenderer);

    this.component = new DockviewComponent(this.hostElement.nativeElement, {
      // Uncomment and configure as you implement Angular panel/tab renderers
      // createTabComponent: () => new DockviewDefaultTabRenderer(),
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

  addPanel(panelConfig: any): void {
    this.dockview.openPanel(panelConfig);
  }

  focusPanel(panelId: string): void {
    this.dockview.focusPanel(panelId);
  }

  private createComponentRenderer(): (
    options: CreateComponentOptions
  ) => IContentRenderer {
    return (_options: CreateComponentOptions): IContentRenderer => {
      // Here, you'd check for an Angular panel registration and delegate.
      // For now, provide a placeholder:
      const div = document.createElement('div');
      div.textContent = '🧪 Default Angular Renderer Content';
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
      (renderer as any).setActions = (actions: any[]) => {
        console.log('[setActions] received:', actions);
      };
      return renderer;
    };
  }
}
