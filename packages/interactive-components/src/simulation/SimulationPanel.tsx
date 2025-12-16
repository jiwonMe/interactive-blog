import * as React from 'react';
import { cx } from '../utils/cx';
import { Panel } from '../primitives/layout/Panel';
import { simulationGrid, simulationRoot } from '../styles/recipes/simulation.css';

type SlotProps = { children: React.ReactNode };

function ControlsSlot(_props: SlotProps) {
  return null;
}
ControlsSlot.displayName = 'SimulationPanel.Controls';

function VisualizationSlot(_props: SlotProps) {
  return null;
}
VisualizationSlot.displayName = 'SimulationPanel.Visualization';

function StatsSlot(_props: SlotProps) {
  return null;
}
StatsSlot.displayName = 'SimulationPanel.Stats';

export interface SimulationPanelProps {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}

function SimulationPanelRoot(props: SimulationPanelProps) {
  const { className, title, description, children } = props;
  let controls: React.ReactNode = null;
  let visualization: React.ReactNode = null;
  let stats: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === ControlsSlot) controls = (child as React.ReactElement<SlotProps>).props.children;
    if (child.type === VisualizationSlot) visualization = (child as React.ReactElement<SlotProps>).props.children;
    if (child.type === StatsSlot) stats = (child as React.ReactElement<SlotProps>).props.children;
  });

  return (
    <Panel className={cx(simulationRoot, className)} title={title} description={description}>
      <div className={simulationGrid}>
        <div>{visualization}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {controls}
          {stats}
        </div>
      </div>
    </Panel>
  );
}

export const SimulationPanel = Object.assign(SimulationPanelRoot, {
  Controls: ControlsSlot,
  Visualization: VisualizationSlot,
  Stats: StatsSlot,
});


