import { ITabRenderer, TabPartInitParameters } from 'dockview-core';
import { DockviewHeaderAction } from '../dockview.types';
import { AngularDockviewService } from '../angular-dockview.service';

export class DockviewDefaultTabRenderer implements ITabRenderer {
  private _element!: HTMLElement;
  private _titleElement!: HTMLElement;
  private _buttonContainer!: HTMLElement;
  private _api!: TabPartInitParameters['api'];

  constructor(private readonly dockviewService: AngularDockviewService) {}

  public init(parameters: TabPartInitParameters): void {
    this._api = parameters.api;

    this._element = document.createElement('div');
    this._element.classList.add('adv-tab');

    this._titleElement = document.createElement('span');
    this._titleElement.classList.add('adv-tab-title');
    this._titleElement.textContent = this._api.title ?? this._api.id;

    this._buttonContainer = document.createElement('div');
    this._buttonContainer.classList.add('adv-tab-buttons');

    this._element.appendChild(this._titleElement);
    this._element.appendChild(this._buttonContainer);

    this.renderButtons();
  }

  public update(parameters: TabPartInitParameters): void {
    this._titleElement.textContent = parameters.api.title ?? parameters.api.id;
    this.renderButtons();
  }

  public dispose(): void {
    this._element.remove();
  }

  get element(): HTMLElement {
    return this._element;
  }

  private renderButtons(): void {
    this._buttonContainer.innerHTML = '';

    const actions: DockviewHeaderAction[] =
      (this._api as any)?._cachedParameters?.params?.headerActions ?? [];

    for (const action of actions) {
      const btn = document.createElement('button');
      btn.classList.add('adv-tab-button');

      if (action.icon) {
        btn.classList.add(...action.icon.split(' '));
      } else if (action.label) {
        btn.textContent = action.label;
      } else {
        btn.textContent = '⚡';
      }

      if (action.tooltip) {
        btn.title = action.tooltip;
      }

      btn.addEventListener('click', () => {
        action.run?.(this._api as any); // cast because `run` expects IDockviewPanel
        this.dockviewService.headerActionFired?.next({
          panelId: this._api.id,
          actionId: action.id,
        });
      });

      this._buttonContainer.appendChild(btn);
    }
  }
}
