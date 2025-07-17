// File: projects/demo/src/app/default-layout.ts

import { DockviewApi } from 'dockview-core';

export const nextId = (() => {
  let counter = 0;
  return () => counter++;
})();

// Header actions for a given panel
function makeActions(panelId: string): any[] {
  return [
    {
      icon: 'codicon-trash',
      tooltip: 'Close Panel',
      action: (panel: any) => panel.api.removePanel(panel),
    },
    {
      icon: 'codicon-window',
      tooltip: 'Open in New Window',
      action: (panel: any) => window.open(`/popout/${panel.id}`, '_blank'),
    },
  ];
}

export function defaultConfig(api: DockviewApi) {
  // Helper to create panels with correct headerActions and positions
  const addPanel = (cfg: {
    id: string;
    title: string;
    referencePanel?: any;
    direction?: 'right' | 'left' | 'below';
  }) => {
    return api.addPanel({
      id: cfg.id,
      component: 'default',
      title: cfg.title,
      params: {
        headerActions: makeActions(cfg.id),
      },
      ...(cfg.referencePanel && cfg.direction
        ? {
            position: {
              referencePanel: cfg.referencePanel,
              direction: cfg.direction,
            },
          }
        : cfg.referencePanel
        ? { position: { referencePanel: cfg.referencePanel } }
        : {}),
    });
  };

  // Panel creation order and layout
  const panel1 = addPanel({ id: 'panel_1', title: 'Panel 1' });
  const panel2 = addPanel({
    id: 'panel_2',
    title: 'Panel 2',
    referencePanel: panel1,
  });
  const panel3 = addPanel({
    id: 'panel_3',
    title: 'Panel 3',
    referencePanel: panel1,
  });
  const panel4 = addPanel({
    id: 'panel_4',
    title: 'Panel 4',
    referencePanel: panel1,
    direction: 'right',
  });
  const panel5 = addPanel({
    id: 'panel_5',
    title: 'Panel 5',
    referencePanel: panel4,
  });
  const panel6 = addPanel({
    id: 'panel_6',
    title: 'Panel 6',
    referencePanel: panel5,
    direction: 'below',
  });
  const panel7 = addPanel({
    id: 'panel_7',
    title: 'Panel 7',
    referencePanel: panel6,
    direction: 'left',
  });
  const panel8 = addPanel({
    id: 'panel_8',
    title: 'Panel 8',
    referencePanel: panel7,
    direction: 'below',
  });

  // Activate the first panel
  panel1.api.setActive();
}
