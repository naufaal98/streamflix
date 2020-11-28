/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  kind?: 'primary' | 'secondary';
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, kind, htmlType, onClick, ...other }) => {
  const buttonClass = kind === 'secondary' ? styles.Secondary : styles.Primary;

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={htmlType || 'button'}
      className={buttonClass}
      onClick={onClick}
      {...other}
    >
      {children}
    </button>
  );
};

export default Button;
