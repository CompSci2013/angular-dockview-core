// header-actions.service.ts
import { Injectable } from '@angular/core';
import { DockviewApi, DockviewPanelApi } from 'dockview-core';

export interface HeaderAction {
  id: string;
  label: string;
  icon: string;
  tooltip: string;
  command: (panelApi: DockviewPanelApi, dockviewApi?: DockviewApi) => void;
}

@Injectable({ providedIn: 'root' })
export class HeaderActionsService {
  private actionsRegistry = new Map<string, HeaderAction[]>();

  private defaultActions: HeaderAction[] = [
    {
      id: 'popout',
      label: 'Popout',
      icon: 'codicon codicon-browser',
      tooltip: 'Open in Floating Window',
      command: (panelApi: DockviewPanelApi, dockviewApi?: DockviewApi) => {
        if (!dockviewApi) return;
        const newGroup = dockviewApi.addGroup({
          referencePanel: panelApi.id,
          direction: 'right',
        });
        panelApi.moveTo({ group: newGroup });
        dockviewApi.addPopoutGroup(newGroup, {
          position: {
            width: 800,
            height: 600,
            left: 100,
            top: 100,
          },
          popoutUrl: '/popout.html',
        });
      },
    },
    {
      id: 'close',
      label: 'Close',
      icon: 'codicon codicon-close',
      tooltip: 'Close Panel',
      command: (panelApi: DockviewPanelApi, dockviewApi?: DockviewApi) => {
        if (!dockviewApi) {
          return;
        }
        const panel = dockviewApi?.getPanel(panelApi.id);
        if (panel) {
          dockviewApi?.removePanel(panel);
        }
      },
    },
  ];

  registerActions(panelType: string, actions: HeaderAction[]): void {
    this.actionsRegistry.set(panelType, actions);
  }

  getActions(panelType: string): HeaderAction[] {
    return this.actionsRegistry.get(panelType) ?? this.defaultActions;
  }

  clearActions(panelType: string): void {
    this.actionsRegistry.delete(panelType);
  }
}
