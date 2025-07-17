// FILE: projects/angular-dockview/src/lib/angular-dockview/dockview-container/dockview-container.oomponent.ts
import {
  AfterViewInit,
  Component,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { DockviewComponent } from 'dockview-core';
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

  @Input() themeClass: string = 'light';

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

  private createComponentRenderer(): (
    options: CreateComponentOptions
  ) => IContentRenderer {
    return (_options: CreateComponentOptions): IContentRenderer => {
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

      // 👇 Augment dynamically with setActions
      (renderer as any).setActions = (actions: any[]) => {
        console.log('[setActions] received:', actions);
      };

      return renderer;
    };
  }
}
