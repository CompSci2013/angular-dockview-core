// File: projects/angular-dockview/src/lib/angular-dockview/dockview-container/dockview-container.component.ts
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
import {
  DockviewComponent,
  DockviewComponentOptions,
  CreateComponentOptions,
  IContentRenderer,
} from 'dockview-core';
import { DockviewApi } from 'dockview-core/dist/cjs/api/component.api';

@Component({
  selector: 'adv-dockview-container',
  template: ` <div #container class="dockview-container"></div> `,
  styles: [
    `
      :host,
      .dockview-container {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class DockviewContainerComponent implements AfterViewInit, OnDestroy {
  /**
   * Expose the Dockview API to consumers of this wrapper
   */
  public get api(): DockviewApi {
    return this.dockview.api;
  }

  /** Optional Dockview configuration options */
  @Input() options?: Partial<DockviewComponentOptions>;

  /**
   * The key (string) for the tab renderer to use.
   * The caller must register the implementation via this.api.registerTabComponent(...)
   */
  @Input() tabComponentKey = 'default';

  /** Factory callback for creating panel content */
  @Input() createComponent!: (options: CreateComponentOptions) => any;

  @ViewChild('container', { static: true, read: ElementRef })
  private container!: ElementRef<HTMLDivElement>;

  /** Emits when a panel is added */
  @Output() didAddPanel = new EventEmitter<DockviewApi>();
  /** Emits when a panel is removed */
  @Output() didRemovePanel = new EventEmitter<DockviewApi>();

  private dockview!: DockviewComponent;
  private disposables: Array<{ dispose(): void }> = [];

  ngAfterViewInit(): void {
    const fullOptions: DockviewComponentOptions = {
      ...((this.options as DockviewComponentOptions) || {}),
      defaultTabComponent: this.tabComponentKey,
    };

    this.dockview = new DockviewComponent(
      this.container.nativeElement,
      fullOptions
    );

    this.disposables.push(
      this.dockview.onDidAddPanel(() =>
        this.didAddPanel.emit(this.dockview.api)
      ),
      this.dockview.onDidRemovePanel(() =>
        this.didRemovePanel.emit(this.dockview.api)
      )
    );
  }

  /**
   * Expose registerPanel for Angular consumers
   */
  // registerPanel(
  //   key: string,
  //   renderer: (options: CreateComponentOptions) => IContentRenderer
  // ): void {
  //   this.dockview.registerPanel(key, renderer);
  // }

  ngOnDestroy(): void {
    this.disposables.forEach((d) => d.dispose());
    this.dockview.dispose();
  }
}
