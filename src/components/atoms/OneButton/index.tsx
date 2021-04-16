import { FC, ReactElement } from 'react';
import Button from 'antd/es/button';
import { ButtonProps } from 'antd/lib/button';
import './style.less';

export const OneButton: FC<ButtonProps> = (props: ButtonProps): ReactElement => {
  return <Button {...props} />;
};

export default OneButton;
