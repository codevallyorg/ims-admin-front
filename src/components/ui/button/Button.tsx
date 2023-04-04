import { Button as ButtonAntd, ButtonProps } from 'antd';
import { FC } from 'react';

const Button: FC<ButtonProps> = ({ ...buttonProps }) => {
  return <ButtonAntd style={{ borderRadius: 8 }} {...buttonProps} />;
};

export default Button;
