import React from 'react';
import PropTypes from 'prop-types';
import getClassName from '../../helpers/getClassName';
import Button from '../Button/Button';
import classNames from '../../lib/classNames';

const baseClassNames = getClassName('File');

const File = props => {
  const { children, align, size, level, type, stretched, before, className, style, getRef, getRootRef, ...restProps } = props;

  return (
    <Button
      align={align}
      className={classNames(baseClassNames, className)}
      component="label"
      type={type}
      stretched={stretched}
      level={level}
      size={size}
      before={before}
      style={style}
      getRootRef={getRootRef}
    >
      <input {...restProps} className="File__input" type="file" ref={getRef}/>
      {children}
    </Button>
  );
};

File.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * @ignore
   */
  level: PropTypes.any,
  /**
   * @ignore
   */
  size: PropTypes.any,
  /**
   * @ignore
   */
  type: PropTypes.any,
  /**
   * @ignore
   */
  align: PropTypes.any,
  /**
   * @ignore
   */
  stretched: PropTypes.any,
  /**
   * @ignore
   */
  before: PropTypes.any,
  getRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
  getRootRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

File.defaultProps = {
  children: 'Выберите файл',
  align: 'left'
};

export default File;
