// projects/angular-dockview/src/lib/dockview-container/dockview-container.component.ts

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
  createSplitview,
  SplitviewApi,
  IView,
  SerializedSplitview,
  SplitviewComponentOptions,
  SplitviewPanel, // abstract at compile time, but concrete at runtime
} from 'dockview-core';

@Component({
  selector: 'adv-dockview-container',
  template: `<div #container class="dockview-container"></div>`,
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
  @ViewChild('container', { static: true })
  containerRef!: ElementRef<HTMLElement>;

  /**
   * Optional overrides for SplitviewComponentOptions
   * (disableAutoResizing, className, etc.).
   * We’ll merge these into a full SplitviewComponentOptions below.
   */
  @Input() options?: Partial<
    Omit<SplitviewComponentOptions, 'createComponent'>
  >;

  /** Optional layout JSON to restore */
  @Input() initialLayout?: SerializedSplitview;

  @Output() didAddView = new EventEmitter<IView>();
  @Output() didRemoveView = new EventEmitter<IView>();
  @Output() layoutChange = new EventEmitter<void>();
  @Output() layoutFromJSON = new EventEmitter<void>();

  private api!: SplitviewApi;

  ngAfterViewInit(): void {
    // 1) Build a “full” SplitviewComponentOptions object, merging user overrides
    //    and supplying a default createComponent factory. We cast to any at the end
    //    so TS will stop complaining about the abstract class or missing members.
    const fullOpts = {
      // default panel factory: we cast SplitviewPanel to any to bypass `abstract`
      createComponent: (params: any) =>
        new (SplitviewPanel as any)(params.id, params.component),

      // merge any other SplitviewOptions the user passed in
      ...(this.options as any),
    } as SplitviewComponentOptions;

    // 2) Call the two-argument createSplitview(...)
    this.api = createSplitview(this.containerRef.nativeElement, fullOpts);

    // 3) Restore layout if provided
    if (this.initialLayout) {
      this.api.fromJSON(this.initialLayout);
      this.layoutFromJSON.emit();
    }

    // 4) Wire up the SplitviewApi events exactly as declared in component.api.d.ts
    this.api.onDidAddView((e) => this.didAddView.emit(e));
    this.api.onDidRemoveView((e) => this.didRemoveView.emit(e));
    this.api.onDidLayoutChange(() => this.layoutChange.emit());
    this.api.onDidLayoutFromJSON(() => this.layoutFromJSON.emit());
  }

  ngOnDestroy(): void {
    this.api.dispose();
  }
}
