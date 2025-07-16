// File: projects/dockview-demo/src/app/default-layout.ts

import { DockviewApi } from 'dockview-core';

export const nextId = (() => {
  let counter = 0;
  return () => counter++;
})();

export function defaultConfig(api: DockviewApi) {
  // Create an array of actions for a given panel instance
  const makeActions = (panel: any): any[] => [
    {
      icon: 'codicon-trash',
      tooltip: 'Close Panel',
      action: () => api.removePanel(panel),
    },
    {
      icon: 'codicon-window',
      tooltip: 'Open in New Window',
      action: () => window.open(`/popout/${panel.id}`, '_blank'),
    },
  ];

  // Panel 1
  const panel1 = api.addPanel({
    id: 'panel_1',
    component: 'default',
    renderer: 'always',
    title: 'Panel 1',
  });
  (panel1 as any).setActions(makeActions(panel1));

  // Panel 2
  const panel2 = api.addPanel({
    id: 'panel_2',
    component: 'default',
    title: 'Panel 2',
    position: { referencePanel: panel1 },
  });
  (panel2 as any).setActions(makeActions(panel2));

  // Panel 3
  const panel3 = api.addPanel({
    id: 'panel_3',
    component: 'default',
    title: 'Panel 3',
    position: { referencePanel: panel1 },
  });
  (panel3 as any).setActions(makeActions(panel3));

  // Panel 4
  const panel4 = api.addPanel({
    id: 'panel_4',
    component: 'default',
    title: 'Panel 4',
    position: { referencePanel: panel1, direction: 'right' },
  });
  (panel4 as any).setActions(makeActions(panel4));

  // Panel 5
  const panel5 = api.addPanel({
    id: 'panel_5',
    component: 'default',
    title: 'Panel 5',
    position: { referencePanel: panel4 },
  });
  (panel5 as any).setActions(makeActions(panel5));

  // Panel 6
  const panel6 = api.addPanel({
    id: 'panel_6',
    component: 'default',
    title: 'Panel 6',
    position: { referencePanel: panel5, direction: 'below' },
  });
  (panel6 as any).setActions(makeActions(panel6));

  // Panel 7
  const panel7 = api.addPanel({
    id: 'panel_7',
    component: 'default',
    title: 'Panel 7',
    position: { referencePanel: panel6, direction: 'left' },
  });
  (panel7 as any).setActions(makeActions(panel7));

  // Panel 8
  const panel8 = api.addPanel({
    id: 'panel_8',
    component: 'default',
    title: 'Panel 8',
    position: { referencePanel: panel7, direction: 'below' },
  });
  (panel8 as any).setActions(makeActions(panel8));

  // Activate the first panel
  panel1.api.setActive();
}
