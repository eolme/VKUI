import { FC, useRef, Children, ReactElement, ReactNode, AnimationEvent, useReducer } from 'react';

import { getClassName } from '../../helpers/getClassName';
import { classNames } from '@vkontakte/vkjs';
import { usePlatform } from '../../hooks/usePlatform';

enum Animate {
  UNMOUNTED = 'unmounted',
  DONE = 'done',
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

  swipePanel: string;
  onSwipeBack: VoidFunction;
};

const updateReducer = () => ({});
const useUpdate = () => {
  return useReducer(updateReducer, updateReducer);
};

const SAFE_INDEX = 16384; // 2 ** 15 / 2

const View: FC<ViewProps> = ({ activePanel, swipePanel, children, direction = Direction.FORWARD, onSwipeBack, ...restProps }) => {
  const [update, forceUpdate] = useUpdate();
  const platform = usePlatform();

  const refHasAnimate = useRef(false);
  const refDirection = useRef<Direction>(direction);
  if (!refHasAnimate.current) {
    refDirection.current = direction;
  }

  const refActiveId = useRef<string>(null);
  const refSwipeId = useRef<string>(swipePanel);
  refSwipeId.current = swipePanel;

  const refElements = useRef<Record<string, HTMLElement>>({});
  const refOrder = useRef<Record<string, number>>({});
  const refAnimate = useRef<Record<string, Animate>>({});

  const refIndex = useRef(SAFE_INDEX);

  if (refActiveId.current === null) {
    refActiveId.current = activePanel;
    refAnimate.current[activePanel] = Animate.STATIC;
    refOrder.current[activePanel] = refIndex.current;
    refHasAnimate.current = false;
  }

  if (refActiveId.current !== activePanel) {
    refActiveId.current = activePanel;

    if (refDirection.current === Direction.BACKWARD) {
      for (const key in refAnimate.current) {
        if (refAnimate.current[key] === Animate.STATIC) {
          refAnimate.current[key] = Animate.ANIMATE;
        }
      }

      refAnimate.current[activePanel] = Animate.STATIC;
      refOrder.current[activePanel] = --refIndex.current;
    } else {
      refAnimate.current[activePanel] = Animate.ANIMATE;
      refOrder.current[activePanel] = ++refIndex.current;
    }

    refHasAnimate.current = true;
  }

  const isAnimationDone = () => {
    for (const key in refAnimate.current) {
      if (refAnimate.current[key] === Animate.ANIMATE) {
        return false;
      }
    }
    return true;
  };

  const onAnimationEnd = useRef((e: AnimationEvent<HTMLElement>) => {
    const panelId = e.currentTarget.dataset.key as string;
    refAnimate.current[panelId] = Animate.DONE;
    if (isAnimationDone()) {
      for (const key in refAnimate.current) {
        refAnimate.current[key] = Animate.UNMOUNTED;
      }
      refAnimate.current[refActiveId.current] = Animate.STATIC;
      refHasAnimate.current = false;
    }
    forceUpdate();
  }).current;

  const panels = Children.map<ReactNode, ReactElement>(children, (panel) => {
    const panelId = panel.props.id;
    const panelAnimate = refAnimate.current[panelId] || Animate.UNMOUNTED;
    const panelOrder = refOrder.current[panelId];

    if (panelAnimate === Animate.UNMOUNTED) {
      return null;
    }

    const classes = `View__panel View__panel--${panelAnimate}`

    const panelAnimationHandler =
      panelAnimate === Animate.ANIMATE ? onAnimationEnd : undefined;

    return (
      <div
        key={panelId}
        data-key={panelId}
        ref={(ref) => ref && (refElements.current[panelId] = ref)}
        vkuiClass={classes}
        style={{ zIndex: panelOrder }}
        onAnimationEnd={panelAnimationHandler}
        data-vkui-active-panel={panelId === refActiveId.current}
      >
        {panel}
      </div>
    );
  });

  const classes = classNames(
    getClassName('View', platform),
    `View--${refDirection.current}`,
    refHasAnimate.current && 'View--animate'
  );

  return (
    <section
      {...restProps}
      vkuiClass={classes}
    >
      {panels}
    </section>
  );
};

export {
  View,
  View as default
};
