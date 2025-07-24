import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { HeaderAction } from '../services/header-actions.service';
import { DockviewPanelApi } from 'dockview-core';

@Component({
  selector: 'adv-tab-renderer',
  template: `
    <div class="dv-tab-title">
      <span class="dv-tab-title-text">{{ title }}</span>
      <button
        *ngFor="let action of headerActions"
        class="dv-tab-action"
        (click)="onActionClick(action)"
      >
        <i [class]="action.icon" [title]="action.tooltip"></i>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DockviewTabRendererComponent {
  @Input() title!: string;
  @Input() headerActions: HeaderAction[] = [];
  @Input() panelApi!: DockviewPanelApi;

  @Output() actionClicked = new EventEmitter<HeaderAction>();

  onActionClick(action: HeaderAction): void {
    action.command(this.panelApi);
    this.actionClicked.emit(action);
  }
}
