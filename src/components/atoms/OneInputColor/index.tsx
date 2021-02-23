import { FC } from 'react';
import Input from 'antd/es/input';
import { InputProps } from 'antd/lib/input';

const OneInputColor: FC<InputProps> = (props: InputProps) => {
  return (
    <Input.Group>
      <Input type="text" style={{ width: '60%' }} {...props} />
      <Input type="color" style={{ width: '40%', padding: '2px 4px' }} {...props} />
    </Input.Group>
  );
};

export default OneInputColor;
