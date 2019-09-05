import React from 'react';
import getClassName from '../../helpers/getClassName';
import classNames from '../../lib/classNames';
import Tappable from '../Tappable/Tappable';
import { HasChildren, HasClassName, HasStyleObject } from '../../types/props';
import usePlatform from '../../hooks/usePlatform';

export interface ButtonProps extends HasStyleObject, HasChildren, HasClassName {
  level?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'commerce' | 'destructive',
  size?: 'm' | 'l' | 'xl',
  align?: 'left' | 'center' | 'right',
  stretched?: boolean,
  before?: React.ReactNode,
  after?: React.ReactNode,
  component?: string | React.ComponentType
}

const Button: React.FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const platform = usePlatform();
  const { className, size, level, stretched, align, children, before, after, ...restProps } = props;

  return <Tappable {...restProps} className={classNames(getClassName('Button', platform), className, {
    [`Button--sz-${size}`]: true,
    [`Button--lvl-${level}`]: true,
    [`Button--aln-${align || 'center'}`]: true,
    [`Button--str`]: stretched
  })} stopPropagation>
    <div className="Button__in">
      {before && <div className="Button__before">{before}</div>}
      {children && <div className="Button__content">{children}</div>}
      {after && <div className="Button__after">{after}</div>}
    </div>
  </Tappable>;
};

Button.defaultProps = {
  level: 'primary',
  component: 'button',
  size: 'm',
  stretched: false
};

export default Button;
