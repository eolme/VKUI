import React, { FC, HTMLAttributes, useMemo, useRef } from 'react';
import { classNames } from '../../lib/classNames';

export interface SplitColContextProps {
  colRef: React.RefObject<HTMLDivElement>;
  animate: boolean;
}

export const SplitColContext = React.createContext<SplitColContextProps>({
  colRef: null,
  animate: true,
});

export interface SplitColProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  maxWidth?: string;
  minWidth?: string;
  /**
   * Если false, то переходы между Panel происходят без анимации
   */
  animate?: boolean;
  /**
   * Если true, то добавляются боковые отступы фиксированной величины
   */
  spaced?: boolean;
  fixed?: boolean;
}

export const SplitCol: FC<SplitColProps> = (props: SplitColProps) => {
  const { children, width, maxWidth, minWidth, spaced, animate, fixed, style, ...restProps } = props;
  const baseRef = useRef<HTMLDivElement>();

  const contextValue = useMemo(() => {
    return {
      colRef: baseRef,
      animate,
    };
  }, [baseRef, animate]);

  return (
    <div
      {...restProps}
      style={{
        ...style,
        width: width,
        maxWidth: maxWidth,
        minWidth: minWidth,
      }}
      ref={baseRef}
      vkuiClass={classNames('SplitCol', {
        'SplitCol--spaced': spaced,
        'SplitCol--fixed': fixed,
      })}
    >
      <SplitColContext.Provider value={contextValue}>
        {fixed ? <div vkuiClass="SplitCol__fixedInner">{children}</div> : children}
      </SplitColContext.Provider>
    </div>
  );
};

SplitCol.defaultProps = {
  animate: false,
};
