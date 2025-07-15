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
} from 'dockview-core';
import { DockviewApi } from 'dockview-core/dist/cjs/api/component.api';
import { DockviewDefaultTabRenderer } from '../dockview-default-tab-renderer';

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
  public get api(): DockviewApi {
    return this.dockview.api;
  }

  @Input() options?: Partial<DockviewComponentOptions>;
  @Input() tabComponentKey = 'default-tab';
  @Input() createComponent!: (options: CreateComponentOptions) => any;

  @ViewChild('container', { static: true, read: ElementRef })
  private container!: ElementRef<HTMLDivElement>;

  @Output() didAddPanel = new EventEmitter<DockviewApi>();
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

    // ✅ Cast to internal type to access `registerTabComponent`
    (this.dockview as any).registerTabComponent(
      this.tabComponentKey,
      DockviewDefaultTabRenderer
    );

    this.disposables.push(
      this.api.onDidAddPanel(() => this.didAddPanel.emit(this.api)),
      this.api.onDidRemovePanel(() => this.didRemovePanel.emit(this.api))
    );
  }

  ngOnDestroy(): void {
    this.disposables.forEach((d) => d.dispose());
    this.dockview.dispose();
  }
}
