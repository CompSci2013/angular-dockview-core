// File: header-actions.service.ts
/* --------------------------------------------------
 * Manages a list of header actions/icons for each panel.
 * -----------------------------------------------------*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DockviewHeaderAction } from '../dockview.types'; // Use your wrapper's header action type

@Injectable({ providedIn: 'root' })
export class HeaderActionsService {
  // panelId → array of actions
  private actions = new Map<string, DockviewHeaderAction[]>();
  private actions$ = new BehaviorSubject<Map<string, DockviewHeaderAction[]>>(
    new Map()
  );

  // Emits when a header action is clicked
  public readonly headerActionFired = new Subject<{
    panelId: string;
    actionId: string;
  }>();

  /**
   * Sets the header actions for a panel.
   */
  setActions(panelId: string, actions: DockviewHeaderAction[]): void {
    this.actions.set(panelId, actions);
    this.emit();
  }

  /**
   * Gets the header actions for a panel.
   */
  getActions(panelId: string): DockviewHeaderAction[] {
    return this.actions.get(panelId) ?? [];
  }

  /**
   * Clears header actions for a panel.
   */
  clearActions(panelId: string): void {
    this.actions.delete(panelId);
    this.emit();
  }

  /**
   * Emits an event when a header action is fired/clicked.
   */
  fireAction(panelId: string, actionId: string): void {
    this.headerActionFired.next({ panelId, actionId });
  }

  /**
   * Observable of all panel header actions (for tracking changes).
   */
  actionsForAllPanels$(): Observable<Map<string, DockviewHeaderAction[]>> {
    return this.actions$.asObservable();
  }

  /**
   * Helper: emits the current state for change detection.
   */
  private emit(): void {
    this.actions$.next(new Map(this.actions));
  }
}
