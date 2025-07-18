import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { DockviewComponent, DockviewComponentOptions } from 'dockview-core';
import type {
  DockviewApi,
  CreateComponentOptions,
  IContentRenderer,
} from 'dockview-core';
// Import service files as present in your canonical source
import { DockviewService } from '../../services/dockview.service';
import { PanelRegistryService } from '../../services/panel-registry.service';
import { RendererRegistryService } from '../../services/render-registry.service';

@Component({
  selector: 'adv-dockview-container',
  templateUrl: './dockview-container.component.html',
  styleUrls: ['./dockview-container.component.css'],
})
export class DockviewContainerComponent implements AfterViewInit {
  @ViewChild('dockviewHost', { static: true }) hostElement!: ElementRef;

  @Input() theme: string = 'dockview-theme-vs-dark';

  @Output() initialized = new EventEmitter<DockviewApi>();
  @Output() panelFocused = new EventEmitter<string>();
  @Output() panelClosed = new EventEmitter<string>();
  @Output() panelAdded = new EventEmitter<string>();
  @Output() layoutChange = new EventEmitter<void>();

  private component!: DockviewComponent;

  constructor(
    private dockview: DockviewService,
    private panelRegistry: PanelRegistryService,
    private renderRegistry: RendererRegistryService
  ) {}

  ngAfterViewInit(): void {
    this.component = new DockviewComponent(this.hostElement.nativeElement, {
      disableAutoResizing: false,
      createComponent: this.createComponentRenderer(),
    });

    this.dockview.setApi(this.component.api);

    this.component.onDidAddPanel((panel) => {
      this.panelAdded.emit(panel.id);
    });
    this.component.onDidRemovePanel((panel) => {
      this.panelClosed.emit(panel.id);
    });
    this.component.onDidActivePanelChange((panel) => {
      if (panel) {
        this.panelFocused.emit(panel.id);
      }
    });
    this.component.onDidLayoutChange(() => {
      this.layoutChange.emit();
    });

    this.initialized.emit(this.component.api);
  }

  public addPanel(panelConfig: any): void {
    this.dockview.openPanel(panelConfig);
  }

  public focusPanel(panelId: string): void {
    this.dockview.focusPanel(panelId);
  }

  private createComponentRenderer(): (
    options: CreateComponentOptions
  ) => IContentRenderer {
    return (_options: CreateComponentOptions): IContentRenderer => {
      const div = document.createElement('div');
      div.textContent = '🧪 Default Angular Renderer Content';
      return {
        element: div,
        init: () => {
          console.log('[init] called for panel');
        },
        update: () => {},
        dispose: () => {},
      };
    };
  }
}
