import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { DockviewComponent } from 'dockview-core';
import { DockviewApi } from 'dockview-core/dist/cjs/api/component.api';
import { IContentRenderer } from 'dockview-core/dist/cjs/dockview/types';

import { DockviewDefaultTabRenderer } from '../../renderers/dockview-default-tab.renderer';
import { RendererRegistryService } from '../../services/render-registry.service';

@Component({
  selector: 'adv-dockview-container',
  templateUrl: './dockview-container.component.html',
  styleUrls: ['./dockview-container.component.css'],
})
export class DockviewContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) hostElementRef!: ElementRef<HTMLElement>;

  @Input() theme: string = '';

  @Output() initialized = new EventEmitter<DockviewComponent>();
  @Output() panelFocused = new EventEmitter<string>();
  @Output() panelClosed = new EventEmitter<string>();
  @Output() panelAdded = new EventEmitter<string>();
  @Output() layoutChange = new EventEmitter<void>();

  private dockviewComponent!: DockviewComponent;
  private dockviewApi!: DockviewApi;

  constructor(private renderRegistry: RendererRegistryService) {}

  ngAfterViewInit(): void {
    // Apply the theme class to the host DOM element
    if (this.theme) {
      this.hostElementRef.nativeElement.classList.add(this.theme);
    }

    // Renderer registry based on `component` name
    const rendererMap: Record<string, () => IContentRenderer> = {
      default: () => new DockviewDefaultTabRenderer(),
    };

    this.dockviewComponent = new DockviewComponent(
      this.hostElementRef.nativeElement,
      {
        disableAutoResizing: false,
        floatingGroupBounds: 'boundedWithinViewport',
        createComponent: (options) => {
          console.log(`[createComponent] id = `, options.id);
          switch (options.id) {
            case 'default':
              return new DockviewDefaultTabRenderer();

            default:
              console.warn(
                `No tab renderer registered for component '${options.id}'`
              );
              return {
                element: document.createElement('div'),
                init: () => {},
                update: () => {},
                dispose: () => {},
              };
          }
        },
      }
    );

    this.dockviewApi = this.dockviewComponent.api;
    this.initialized.emit(this.dockviewComponent);
  }

  ngOnDestroy(): void {
    this.dockviewComponent?.dispose();
  }

  public addPanel(config: any): void {
    this.dockviewApi?.addPanel({
      id: config.id,
      title: config.title,
      component: config.component,
      position: config.position,
      params: config.inputs || {},
    });
  }

  public focusPanel(id: string): void {
    this.dockviewApi?.getPanel(id)?.focus();
  }
}
