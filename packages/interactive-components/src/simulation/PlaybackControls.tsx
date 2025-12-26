import * as React from 'react';
import { ControlBar } from '../primitives/layout/ControlBar';
import { Button } from '../primitives/controls/Button';

export interface PlaybackControlsProps {
  isPlaying: boolean;
  canRun?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onToggleRunning?: () => void;
  onStep?: () => void;
  onReset?: () => void;
}

export function PlaybackControls(props: PlaybackControlsProps) {
  const {
    isPlaying,
    canRun = true,
    onPlay,
    onPause,
    onToggleRunning,
    onStep,
    onReset,
  } = props;
  const toggle = onToggleRunning ?? (isPlaying ? onPause : onPlay);

  return (
    <ControlBar>
      <ControlBar.Group>
        <Button
          variant="primary"
          disabled={!canRun}
          onClick={() => {
            toggle?.();
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="secondary"
          disabled={!canRun}
          onClick={() => {
            onStep?.();
          }}
        >
          Step
        </Button>
        <Button
          variant="ghost"
          disabled={!canRun}
          onClick={() => {
            onReset?.();
          }}
        >
          Reset
        </Button>
      </ControlBar.Group>
    </ControlBar>
  );
}






