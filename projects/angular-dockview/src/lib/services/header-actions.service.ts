// File: header-actions.service.ts
/* --------------------------------------------------
 * Centralize common panel actions (like "popout") in a single injectable Angular service.
 * This makes behavior consistent and easier to extend or modify.
 * -----------------------------------------------------*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DockviewHeaderAction } from '../dockview.types'; // Use your wrapper's header action type

@Injectable({ providedIn: 'root' })
export class HeaderActionsService {
  private defaultHeaderActions: DockviewHeaderAction[] = [
    {
      id: 'popout',
      label: 'Popout',
      icon: 'codicon codicon-link-external',
      tooltip: 'Open in Floating Window',
      command: (panel: any) => {
        panel.popout?.();
      },
      run: () => {}, // required placeholder
    },
  ];

  getDefaultActions(): DockviewHeaderAction[] {
    return this.defaultHeaderActions;
  }

  addDefaultAction(action: DockviewHeaderAction): void {
    if (!this.defaultHeaderActions.find((a) => a.id === action.id)) {
      this.defaultHeaderActions.push(action);
    }
  }
}
