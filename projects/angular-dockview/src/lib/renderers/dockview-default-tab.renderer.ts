import {
  IContentRenderer,
  GroupPanelPartInitParameters,
} from 'dockview-core/dist/cjs/dockview/types';

export class DockviewDefaultTabRenderer implements IContentRenderer {
  public readonly element: HTMLElement;
  private titleElement: HTMLElement | null = null;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('dv-tab-title');

    this.titleElement = document.createElement('span');
    this.titleElement.classList.add('dv-tab-title-text');
    this.element.appendChild(this.titleElement);
  }

  init(params: GroupPanelPartInitParameters): void {
    this.titleElement!.textContent = params.title ?? '';

    const headerActions = params.params?.['headerActions'] ?? [];

    // ✅ Set header buttons using container API
    params.api.updateParameters({ headerActions });
  }

  update(): void {
    // Future state-based updates can go here
  }

  dispose(): void {
    this.element.remove();
    this.titleElement = null;
  }
}
