import type { IDockviewPanel } from 'dockview-core';

export interface DockviewHeaderAction {
  id: string;
  tooltip?: string;
  icon?: string; // e.g., 'codicon codicon-new-window'
  label?: string;
  order?: number;
  run: (panel: IDockviewPanel) => void;
}

export interface DockviewInputValues {
  [key: string]: any;
}

export interface DockviewPanelConfig {
  id: string;
  title?: string;
  component: string;
  inputs?: DockviewInputValues;
  float?: boolean;
  headerActions?: DockviewHeaderAction[];
}

/**
 * Optional base interface for Angular panel components.
 * Not required for registration, but helps ensure compatibility with Dockview API.
 */
export interface DockviewPanel {
  id?: string;
  title?: string;
  [key: string]: unknown;
}

/**
 * Used by our custom tab renderer. Passed into PanelUpdateEvent<T>.
 */
export interface DockviewTabRendererParams {
  title: string;
}
