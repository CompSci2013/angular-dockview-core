// File: event-bus.service.ts

/* ------------------------------------------
 * Simple event hub for cross-service/component comms (could be improved with event type union/interface).
 * ------------------------------------------ */

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type DockviewEvent =
  | { type: 'panelClosed'; panelId: string }
  | { type: 'panelFocused'; panelId: string }
  | { type: 'panelAdded'; panelId: string }
  | { type: 'headerActionClicked'; panelId: string; actionId: string }
  | { type: 'floatingStateChanged'; panelId: string; floating: boolean };
// Add more event types as needed

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private event$ = new Subject<DockviewEvent>();

  emit(event: DockviewEvent): void {
    this.event$.next(event);
  }

  on(): Observable<DockviewEvent> {
    return this.event$.asObservable();
  }
}
