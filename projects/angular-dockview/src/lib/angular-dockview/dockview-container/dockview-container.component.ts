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
    this.hostElementRef.nativeElement.classList.add(this.theme);

    this.dockviewComponent = new DockviewComponent(
      this.hostElementRef.nativeElement,
      {
        disableAutoResizing: false,
        floatingGroupBounds: 'boundedWithinViewport',
        createComponent: (_options) => {
          return new DockviewDefaultTabRenderer();
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
    this.dockviewApi?.addPanel(config);
  }

  public focusPanel(id: string): void {
    this.dockviewApi?.getPanel(id)?.focus();
  }
}
