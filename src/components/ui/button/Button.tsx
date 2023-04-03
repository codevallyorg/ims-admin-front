import { Button as ButtonAntd, ButtonProps } from 'antd';
import { FC } from 'react';
import styles from './Button.module.css';

const Button: FC<ButtonProps> = ({ ...buttonProps }) => {
  return <ButtonAntd className={styles.button} {...buttonProps} />;
};

export default Button;
