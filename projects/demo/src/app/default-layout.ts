// File: projects/demo/src/app/default-layout.ts

import { DockviewContainerComponent } from 'angular-dockview';

export const nextId = (() => {
  let counter = 9;
  return () => counter++;
})();

function makeActions(panelId: string): any[] {
  return [
    {
      icon: 'codicon-trash',
      tooltip: 'Close Panel',
      action: (_panel: any) => {
        // Provide proper closing logic here if needed.
      },
    },
    {
      icon: 'codicon-window',
      tooltip: 'Open in New Window',
      action: (_panel: any) => window.open(`/popout/${panelId}`, '_blank'),
    },
  ];
}

export function defaultConfig(dockview: DockviewContainerComponent) {
  const addPanel = (cfg: {
    id: string;
    component: string; // Now required in the call
    title: string;
    referencePanelId?: string;
    direction?: 'right' | 'left' | 'below';
  }) => {
    let position: any = undefined;
    if (cfg.referencePanelId) {
      position = { referencePanel: cfg.referencePanelId };
      if (cfg.direction) {
        position.direction = cfg.direction;
      }
    }

    dockview.addPanel({
      id: cfg.id,
      component: cfg.component,
      title: cfg.title,
      position,
      inputs: {
        headerActions: makeActions(cfg.id),
      },
    });
  };

  addPanel({ id: 'panel_1', component: 'default', title: 'Panel 1' });
  addPanel({
    id: 'panel_2',
    component: 'default',
    title: 'Panel 2',
    referencePanelId: 'panel_1',
  });
  addPanel({
    id: 'panel_3',
    component: 'default',
    title: 'Panel 3',
    referencePanelId: 'panel_1',
  });
  addPanel({
    id: 'panel_4',
    component: 'default',
    title: 'Panel 4',
    referencePanelId: 'panel_1',
  });
  addPanel({
    id: 'panel_5',
    component: 'default',
    title: 'Panel 5',
    referencePanelId: 'panel_4',
  });
  addPanel({
    id: 'panel_6',
    component: 'default',
    title: 'Panel 6',
    referencePanelId: 'panel_5',
    direction: 'below',
  });
  addPanel({
    id: 'panel_7',
    component: 'default',
    title: 'Panel 7',
    referencePanelId: 'panel_6',
    direction: 'left',
  });
  addPanel({
    id: 'panel_8',
    component: 'default',
    title: 'Panel 8',
    referencePanelId: 'panel_4',
    direction: 'below',
  });

  dockview.focusPanel?.('panel_1');
}
