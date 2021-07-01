import { FC, useMemo, useRef, Children, ReactElement, ReactNode, AnimationEvent, useReducer } from 'react';

import { getClassName } from '../../helpers/getClassName';
import { classNames } from '@vkontakte/vkjs';

enum Animate {
  UNMOUNTED = 'unmounted',
  STATIC = 'static',
  ANIMATE = 'animate'
};

enum Direction {
  FORWARD = 'forward',
  BACKWARD = 'backward'
};

type ViewProps = {
  children: ReactElement | ReactElement[];
  activePanel: string;
  direction: Direction;
};

const updateReducer = () => ({});
const useUpdate = () => {
  return useReducer(updateReducer, updateReducer);
};

const SAFE_INDEX = 16384; // 2 ** 15 / 2

const View: FC<ViewProps> = ({ activePanel, children, direction = Direction.FORWARD }) => {
  const [update, forceUpdate] = useUpdate();
  const refHasAnimate = useRef(false);

  const refActive = useRef(activePanel);

  const refLower = useRef(SAFE_INDEX);
  const refUpper = useRef(SAFE_INDEX);

  const refOrder = useRef<Record<string, number>>({});
  const refAnimate = useRef<Record<string, Animate>>({});
  const refDirection = useRef<Record<string, Direction>>({});

  if (activePanel !== refActive.current) {
    refActive.current = activePanel;
    refDirection.current[activePanel] = direction;

    if (direction === Direction.BACKWARD) {
      for (const id in refAnimate.current) {
        if (refAnimate.current[id] === Animate.STATIC) {
          refAnimate.current[id] = Animate.ANIMATE;
        }
      }
      refAnimate.current[activePanel] = Animate.STATIC;
    }

    refOrder.current[activePanel] = direction === Direction.FORWARD ? ++refUpper.current : --refLower.current;
    refHasAnimate.current = true;
  }

  const onAnimationEnd = useRef((e: AnimationEvent<HTMLElement>) => {
    refAnimate.current[e.currentTarget.dataset.key as string] = Animate.UNMOUNTED;
    for (const id in refAnimate.current) {
      if (refAnimate.current[id] === Animate.ANIMATE) {
        return;
      }
    }
    for (const id in refAnimate.current) {
      if (refAnimate.current[id] === Animate.STATIC) {
        refAnimate.current[id] = Animate.UNMOUNTED;
      }
    }
    refAnimate.current[refActive.current] = Animate.STATIC;
    refHasAnimate.current = false;
    forceUpdate();
  }).current;

  const panels = useMemo(() => {
    const panels = Children.map<ReactNode, ReactElement>(children, (panel) => {
      const panelId = panel.props.id as string;
      const animate = refAnimate.current[panelId] || (
        panelId === activePanel ? Animate.STATIC : Animate.UNMOUNTED
      );

      refAnimate.current[panelId] = animate;
      if (!refHasAnimate.current && animate === Animate.UNMOUNTED) {
        return null;
      }

      const currentDirection = refDirection.current[panelId] || direction;
      const zIndex = refOrder.current[panelId] || SAFE_INDEX;

      const classes = `View__panel View__panel--${animate} View__panel--${currentDirection}`;
      return (
        <div
          key={panelId}
          data-key={panelId}
          style={{ zIndex }}
          vkuiClass={classes}
          onAnimationEnd={onAnimationEnd}
        >
          {panel}
        </div>
      );
    });
    refActive.current = activePanel;
    return panels;
  }, [activePanel, update, children]);

  const classes = classNames(getClassName('View'), refHasAnimate.current ? 'View--animate' : '');

  return (
    <div vkuiClass={classes}>
      {panels}
    </div>
  );
};

export {
  View,
  View as default
};
